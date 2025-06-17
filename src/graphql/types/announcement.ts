// src/graphql/types/announcement.ts
export const announcementType = `
    "An announcement that can be sent to customers"
    type Announcement {
        "Unique identifier for the announcement"
        _id: ID!
        "The customer this announcement is for"
        customer: Customer!
        "The content/message of the announcement"
        content: String!
        "When the announcement should be sent"
        scheduledTime: String!
        "Whether the announcement has been sent"
        isSent: Boolean!
        "When the announcement was created"
        createdAt: String!
        "When the announcement was last updated"
        updatedAt: String!
    }

    "Input type for creating a new announcement"
    input AnnouncementInput {
        "ID of the customer to send the announcement to"
        customerId: ID!
        "The content/message of the announcement"
        content: String!
        "When the announcement should be sent"
        scheduledTime: String!
    }

    "Input type for updating an existing announcement"
    input AnnouncementUpdateInput {
        "The new content/message of the announcement"
        content: String
        "The new scheduled time for the announcement"
        scheduledTime: String
        "Whether the announcement has been sent"
        isSent: Boolean
    }

    type Query {
        "Get all announcements"
        announcements: [Announcement!]!
        "Get a specific announcement by ID"
        announcement(id: ID!): Announcement!
    }

    type Mutation {
        "Create a new announcement"
        createAnnouncement(input: AnnouncementInput!): Announcement!
        "Update an existing announcement"
        updateAnnouncement(id: ID!, input: AnnouncementUpdateInput!): Announcement!
        "Delete an announcement"
        deleteAnnouncement(id: ID!): Boolean!
    }
`;
