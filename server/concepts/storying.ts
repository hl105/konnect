import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface StoryDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  type: string;
  postId: ObjectId; //e.g. metId.
  text: string;
  period: string;
  contexts: JSON[];
}

/**
 * concept: Storying [Author, Post, Comment]
 */
export default class StoryingConcept {
  public readonly stories: DocCollection<StoryDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.stories = new DocCollection<StoryDoc>(collectionName);
  }

  /**
   * Creates Story
   */
  async createStory(author: ObjectId, title: string, type: string, postId: ObjectId, text: string, period: string, contexts: JSON[]) {
    const story = await this.stories.readOne({ title });

    if (story) {
      return { msg: "Object exists!", story: story };
    } else {
      try {
        const _id = await this.stories.createOne({ author, title, type, postId, text, period, contexts });
        return { msg: "Story successfully created!", story: await this.stories.readOne({ _id }) };
      } catch (error) {
        console.error("Error creating story:", error);
        throw error;
      }
    }
  }

  async getContexts(_id: ObjectId) {
    const story = await this.stories.readOne({ _id });
    return story?.contexts;
  }

  // async getStories() {
  //   return await this.stories.readMany({}, { sort: { _id: -1 } });
  // }

  async getById(id: ObjectId) {
    return await this.stories.readOne({ _id: id });
  }

  async getByPostId(postId: ObjectId) {
    // returns story with given postId
    return await this.stories.readOne({ postId });
  }

  async getByEra(eraName: string) {
    const map: { [key: string]: string } = { "three-kingdoms": "Three Kingdoms period (57 BCE–676 CE)", goryeo: "Goryeo dynasty (918–1392)", joseon: "Joseon dynasty (1392–1910)" };
    const period = map[eraName];
    if (!period) {
      throw new Error(`Era name "${eraName}" is not valid.`); // Handle invalid eraName
    }
    console.log("ERIOD", period);
    const test = await this.stories.readMany({ period });
    console.log("TESTTT", test);
    return await this.stories.readMany({ period });
  }

  async getAllperiods() {
    return await this.stories.collection.distinct("period");
  }

  async getAllAuthorsInperiod(period: string) {
    return await this.stories.collection.distinct("authors", { period });
  }

  async getNumAuthorsInperiod(period: string) {
    const authors = await this.getAllAuthorsInperiod(period);
    return authors.length;
  }

  async getByAuthor(author: ObjectId) {
    return await this.stories.readMany({ author });
  }

  // async addComment(_id: ObjectId, comment: ObjectId) {
  //   await this.stories.collection.updateOne({ _id }, { $push: { comments: comment } });
  // }

  async update(title: string, contentUpdates?: Partial<StoryDoc>) {
    if (!contentUpdates || Object.keys(contentUpdates).length === 0) {
      throw new Error("No content updates provided.");
    }

    const allowedKeys = ["title", "text", "period", "completed"];

    // Validate that all keys in contentUpdates are allowed
    for (const key in contentUpdates) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Invalid field for update: ${key}`);
      }
    }

    try {
      await this.stories.partialUpdateOne({ title }, contentUpdates);

      return { msg: "Post successfully updated!" };
    } catch (error: any) {
      console.error("Error updating post:", error.message || error);
      throw new Error(`Failed to update post: ${error.message || error}`);
    }
  }

  async delete(_id: ObjectId) {
    await this.stories.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    if (_id.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
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
