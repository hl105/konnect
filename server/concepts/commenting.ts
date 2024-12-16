import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  story: ObjectId;
  author: ObjectId;
  text: string;
  title: string; // to hyperlink to
  image: string;
}

/**
 * concept: Commenting [story]
 */

export default class CommentingConcept {
  public readonly comments: DocCollection<CommentDoc>;

  /**
   * Make an instance of Commenting
   */
  constructor(collectionName: string) {
    this.comments = new DocCollection<CommentDoc>(collectionName);
  }

  async create(story: ObjectId, author: ObjectId, text?: string, title?: string, image?: string) {
    const _id = await this.comments.createOne({ story, author, text, title, image });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
  }

  async getComments() {
    //Returns all comments
    return await this.comments.readMany({}, { sort: { _id: -1 } });
  }

  async getCommentById(_id: ObjectId) {
    const user = await this.comments.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return user;
  }

  async getByAuthor(author: ObjectId, filter?: object) {
    return await this.comments.readMany({ author });
  }

  async getByStory(story: ObjectId) {
    return await this.comments.readMany({ story });
  }

  async getByAuthorAndStory(author: ObjectId, story: ObjectId) {
    return await this.comments.readMany({ author, story });
  }

  async update(_id: ObjectId, text?: string, title?: string, image?: string) {
    await this.comments.partialUpdateOne({ _id }, { text, title, image });
    return { msg: "Comment successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async deleteByAuthor(author: ObjectId) {
    await this.comments.deleteMany({ author });
    return { msg: "Comments have been deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of comment {1}!", author, _id);
  }
}
