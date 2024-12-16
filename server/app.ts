import AuthenticatingConcept from "./concepts/authenticating";
import CommentingConcept from "./concepts/commenting";
import PostingConcept from "./concepts/posting";
import RewardingConcept from "./concepts/rewarding";
import SessioningConcept from "./concepts/sessioning";
import StoryingConcept from "./concepts/storying";
// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Storying = new StoryingConcept("stories");
export const Commenting = new CommentingConcept("comments");
export const Rewarding = new RewardingConcept("userBadges", "badgeDefinitions");
