import gql from 'graphql-tag';

export const READ_MESSAGE_PAGINATION = gql`
  query readMessageByChannelByDate($channelId: String!, $first: Float!, $skip: Float!) {
    readMessageByChannelByDate(channelId: $channelId,  first: $first, skip: $skip ) {
      subType,
      type,
      _id,
      text,
      ts,
      updatedAt,
      channelId,
      senderId,
    }
  }
`;
