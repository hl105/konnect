import axios from "axios";
import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface MetObjectData {
  objectID: string;
  title: string;
  primaryImage: string;
  additionalImages: string[];
  culture: string;
  period: string;
  dynasty: string;
  objectName: string;
  objectDate: string;
  department: string;
  medium: string;
  creditLine: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistWikidata_URL: string;
}

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  objectID: string;
  title: string;
  primaryImage: string;
  additionalImages: string[];
  culture: string;
  period: string;
  dynasty: string;
  objectName: string;
  objectDate: string;
  department: string;
  medium: string;
  description: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistWikidata_URL: string;
}

/**
 * concept: Posting [Author]
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName);
  }

  /**
   * Fetches artwork data from The Met API for a given objectID and creates a post
   */
  async createPostFromMetObject(author: ObjectId, objectID: string) {
    const post = await this.posts.readOne({ objectID });

    if (post) {
      return { msg: "Object exists!", post: post };
    } else {
      const apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;

      try {
        const response = await axios.get<MetObjectData>(apiUrl);

        const data = response.data;

        const postData: Partial<PostDoc> = {
          author,
          objectID: data.objectID ? String(data.objectID) : "N/A",
          title: data.title || "Unknown Title",
          primaryImage: data.primaryImage || "",
          additionalImages: data.additionalImages ? data.additionalImages : [""],
          culture: data.culture || "Unknown Culture",
          period: data.period || "Unknown Period",
          dynasty: data.dynasty || "Unknown Dynasty",
          objectName: data.objectName || "Unknown Object Name",
          objectDate: data.objectDate || "Unknown Date",
          department: data.department || "Unknown Department",
          medium: data.medium || "Unknown Medium",
          description: data.creditLine || "No description provided",
          artistDisplayName: data.artistDisplayName || "Unknown Artist",
          artistDisplayBio: data.artistDisplayBio || "",
          artistWikidata_URL: data.artistWikidata_URL || "",
        };

        const _id = await this.posts.createOne(postData);
        return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
      } catch (error) {
        console.error("Error creating post from Met object:", error);
        throw error;
      }
    }
  }

  async getPosts() {
    return await this.posts.readMany({}, { sort: { _id: -1 } });
  }

  async getPostsByEra(eraName: string) {
    const map: { [key: string]: string } = { "three-kingdoms": "Three Kingdoms period (57 BCE–676 CE)", goryeo: "Goryeo dynasty (918–1392)", joseon: "Joseon dynasty (1392–1910)" };
    const period = map[eraName];

    if (!period) {
      return await this.posts.readMany({});
    }
    return await this.posts.readMany({ period });
  }

  async getById(id: ObjectId) {
    return await this.posts.readOne({ _id: id });
  }

  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author });
  }

  async update(objectID: string, contentUpdates?: Partial<PostDoc>) {
    if (!contentUpdates || Object.keys(contentUpdates).length === 0) {
      throw new Error("No content updates provided.");
    }

    const allowedKeys = [
      "objectID",
      "title",
      "primaryImage",
      "additionalImages",
      "culture",
      "period",
      "dynasty",
      "objectName",
      "objectDate",
      "department",
      "medium",
      "description",
      "artistDisplayName",
      "artistDisplayBio",
      "artistWikidata_URL",
    ];

    // Validate that all keys in contentUpdates are allowed
    for (const key in contentUpdates) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Invalid field for update: ${key}`);
      }
    }

    try {
      // Pass contentUpdates directly without wrapping it in another object
      await this.posts.partialUpdateOne({ objectID }, contentUpdates);

      return { msg: "Post successfully updated!" };
    } catch (error: any) {
      console.error("Error updating post:", error.message || error);
      throw new Error(`Failed to update post: ${error.message || error}`);
    }
  }

  async delete(_id: ObjectId) {
    await this.posts.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    if (_id.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }

  /**
   * Retrieves a post by the given objectID from the Met API data
   * @param objectID - The object ID to search for within the `content` field
   * @returns The post document that matches the given objectID, or null if not found
   */
  async getByObjectId(objectID: string) {
    const post = await this.posts.readOne({ objectID });
    if (!post) {
      throw new NotFoundError(`Post with objectID ${objectID} does not exist!`);
    }
    return post;
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
