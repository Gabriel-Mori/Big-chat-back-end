import User from "./User";
import Plan from "./Plan";
import Conversation from "./Conversation";
import Message from "./Message";

// Associações
User.hasOne(Plan, {foreignKey: "userId", as: "plan"});
Plan.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Conversation, {foreignKey: "clientId", as: "clientConversations"});
User.hasMany(Conversation, {
  foreignKey: "recipientId",
  as: "recipientConversations",
});
Conversation.belongsTo(User, {foreignKey: "clientId", as: "client"});
Conversation.belongsTo(User, {foreignKey: "recipientId", as: "recipient"});

Conversation.hasMany(Message, {foreignKey: "conversationId", as: "messages"});
Message.belongsTo(Conversation, {foreignKey: "conversationId"});

export {User, Plan, Conversation, Message};
