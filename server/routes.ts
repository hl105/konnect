import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Commenting, Posting, Rewarding, Sessioning, Storying } from "./app";
import { PostDoc } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
// import Responses from "./responses";

import { z } from "zod";
import { Badge } from "./concepts/rewarding";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    const response = await Authing.create(username, password);
    if (response.user) {
      await Rewarding.addUserToUsersBadges(response.user._id);
    }
    return response;
  }

  // @Router.get("/artwork/dynasty/:dynastyName")
  // async getAllPostsByDynasty(dynastyName: string, req: Request, res: Response) {
  //   // Map dynasty names to category slugs or IDs
  //   const categoryMap: { [key: string]: string } = {
  //     "three-kingdoms": "three-kingdoms", // Replace with actual slug or ID
  //     goryeo: "goryeo",
  //     joseon: "joseon",
  //   };

  //   // Artwork category ID (replace with actual ID or fetch dynamically)
  //   const artworkCategoryId = "artwork"; // Replace with slug or actual ID if needed

  //   // Get the dynasty category slug or ID
  //   const dynastySlugOrId = categoryMap[dynastyName];
  //   if (!dynastySlugOrId) {
  //     return res.status(400).json({ error: "Invalid dynasty name" });
  //   }

  //   try {
  //     // Call the WordPress REST API to fetch posts with matching categories
  //     const response = await axios.get(`http://your-wordpress-site.com/wp-json/wp/v2/posts`, {
  //       params: {
  //         categories: `${dynastySlugOrId},${artworkCategoryId}`,
  //         _embed: true, // Fetch featured media
  //       },
  //     });

  //     res.status(response.status).json(response.data);
  //   } catch {
  //     console.error("Error fetching posts from WordPress:");
  //     res.status(500).json({ error: "Failed to fetch posts" });
  //   }
  // }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    await Rewarding.deleteUserFromUsersBadges(user);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in now!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts() {
    // const posts = await Posting.getPosts();
    return await Posting.getPosts();
  }

  @Router.get("/posts/:eraName")
  async getPostsByEra(eraName: string) {
    return await Posting.getPostsByEra(eraName);
  }

  @Router.get("/posts/objectID/:objectID")
  async getPostsByObjectID(objectID: string) {
    const post = await Posting.getByObjectId(objectID);
    return post;
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, objectID: string) {
    const user = Sessioning.getUser(session);
    const created = await Posting.createPostFromMetObject(user, objectID);
    return { msg: created.msg, post: await created.post };
  }

  @Router.patch("/posts/:objectID/:content?")
  async updatePost(session: SessionDoc, objectID: string, content?: Partial<PostDoc>) {
    const user = Sessioning.getUser(session);
    const post = await Posting.getByObjectId(objectID);
    await Posting.assertAuthorIsUser(post.author, user);
    return await Posting.update(objectID, content);
  }

  @Router.delete("/posts/:postId")
  async deletePost(session: SessionDoc, postId: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(postId);
    const post = await Posting.getById(oid);
    if (post) {
      await Posting.assertAuthorIsUser(post.author, user);
      return Posting.delete(oid);
    }
  }

  @Router.get("/posts/:postId/comments")
  async getPost(postId: string) {
    const oid = new ObjectId(postId);
    return await Commenting.getByStory(oid);
  }

  // @Router.post("/posts/:postId/comments")
  // async createComment(session: SessionDoc, postId: string, text?: string, title?: string, image?: string) {
  //   const user = Sessioning.getUser(session);
  //   const oid = new ObjectId(postId);
  //   return await Commenting.create(oid, user, text, title, image);
  // }

  // @Router.patch("/comments/:commentId")
  // async updateComment(session: SessionDoc, commentId: string, text?: string, title?: string, image?: string) {
  //   const user = Sessioning.getUser(session);
  //   const oid = new ObjectId(commentId);
  //   const comment = await Commenting.getCommentById(oid);
  //   if (comment.author != user) {
  //     throw Error("Comment author is not user");
  //   }
  //   await Commenting.update(oid, text, title, image);
  //   return comment;
  // }

  // @Router.delete("/comments/:commentId")
  // async deleteComment(session: SessionDoc, commentId: string) {
  //   const user = Sessioning.getUser(session);
  //   const oid = new ObjectId(commentId);
  //   const comment = await Commenting.getCommentById(oid);
  //   if (comment.author != user) {
  //     throw Error("Comment author is not user");
  //   }
  //   return await Commenting.delete(oid);
  // }

  @Router.post("/stories")
  async postStory(session: SessionDoc, title: string, type: string, postId: string, text: string, period: string, contexts: JSON[]) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(postId);
    const created = await Storying.createStory(user, title, type, oid, text, period, contexts);
    const storytellerBadge = new ObjectId("6752c77cf9693480255c7fd8");
    const response = await Rewarding.addPoints(user, storytellerBadge, 1);
    const earned = response.earned ? "updated" : "no change";
    const started = response.started ? "start new badge" : "no change";
    const res = { msg: created.msg, story: await created.story, earned: earned, started: started };
    return res;
  }

  @Router.get("/stories/:storyId")
  async getStory(storyId: string) {
    const oid = new ObjectId(storyId);
    return await Storying.getById(oid);
  }

  @Router.get("/stories/post/:postId")
  async getStoryByPostId(postId: string) {
    const oid = new ObjectId(postId);
    const story = await Storying.getByPostId(oid);
    const storyId = story?._id;
    console.log(storyId);
    return storyId;
  }

  @Router.get("/stories/era/:era")
  async getStoryByEra(era: string) {
    return await Storying.getByEra(era);
  }

  @Router.get("/stories/artwork/:storyId/contexts")
  async getContexts(storyId: string) {
    const oid = new ObjectId(storyId);
    return await Storying.getContexts(oid);
  }

  @Router.get("/badges")
  async getDefinedBadges() {
    return await Rewarding.getAllDefinedBadges();
  }

  @Router.post("/badges")
  async defineBadge(content: Partial<Badge>) {
    const { name, logo, threshold, hashtags } = content;
    if (!name || !logo || !threshold) {
      throw new Error("Missing required fields: name, logo, or threshold.");
    }
    return await Rewarding.addBadge(name, logo, threshold, hashtags);
  }

  @Router.patch("/badges/:badgeId")
  async updateBadge(badgeId: string, updates: Partial<Badge>) {
    const oid = new ObjectId(badgeId);
    return await Rewarding.updateBadge(oid, updates);
  }

  @Router.delete("/badges/:badgeId")
  async deleteBadge(badgeId: string) {
    const oid = new ObjectId(badgeId);
    return await Rewarding.deleteBadge(oid);
  }

  @Router.get("/user/:username/badges")
  async getUserBadges(username: string) {
    const user = await Authing.getUserByUsername(username);
    return await Rewarding.getUserBadges(user._id);
  }

  @Router.post("/user/:userId/badges/:badgeId")
  async addPoints(userId: string, badgeId: string, pointsToAdd: { points: number }) {
    if (!pointsToAdd || typeof pointsToAdd.points === "undefined") {
      throw new Error("Invalid request: 'points' is required in the JSON body.");
    }
    const { points } = pointsToAdd;
    if (!points) {
      throw new Error("Missing required field points");
    }
    const uid = new ObjectId(userId);
    const bid = new ObjectId(badgeId);
    return await Rewarding.addPoints(uid, bid, points);
  }
}
/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
