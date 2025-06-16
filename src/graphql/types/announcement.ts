// src/graphql/types/announcement.ts
export const announcementType = `
    "An announcement that can be sent to customers"
    type Announcement {
        "Unique identifier for the announcement"
        _id: ID!
        "The customer this announcement is for"
        customer_id: Customer!
        "The content/message of the announcement"
        content: String!
        "When the announcement should be sent"
        scheduled_time: String!
        "Whether the announcement has been sent"
        is_sent: Boolean!
        "When the announcement was created"
        created_at: String!
        "When the announcement was last updated"
        updated_at: String!
    }

    "Input type for creating a new announcement"
    input AnnouncementInput {
        "ID of the customer to send the announcement to"
        customer_id: ID!
        "The content/message of the announcement"
        content: String!
        "When the announcement should be sent"
        scheduled_time: String!
    }

    "Input type for updating an existing announcement"
    input AnnouncementUpdateInput {
        "The new content/message of the announcement"
        content: String
        "The new scheduled time for the announcement"
        scheduled_time: String
        "Whether the announcement has been sent"
        is_sent: Boolean
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
