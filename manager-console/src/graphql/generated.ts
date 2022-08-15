import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type MessageInput = {
  Keyword: Scalars['ID'];
  Message?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage?: Maybe<Message>;
  deleteMessage?: Maybe<Message>;
};


export type MutationAddMessageArgs = {
  input: MessageInput;
};


export type MutationDeleteMessageArgs = {
  Keyword: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getMessage?: Maybe<Message>;
  listMessages?: Maybe<Array<Message>>;
};


export type QueryGetMessageArgs = {
  Keyword: Scalars['ID'];
};

export type Message = {
  __typename?: 'message';
  Keyword: Scalars['ID'];
  Message?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
};

export type GetMessageQueryVariables = Exact<{
  keyword?: InputMaybe<Scalars['ID']>;
}>;


export type GetMessageQuery = { __typename?: 'Query', getMessage?: { __typename?: 'message', Keyword: string, Message?: string | null, Name?: string | null } | null };

export type ListMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListMessagesQuery = { __typename?: 'Query', listMessages?: Array<{ __typename?: 'message', Keyword: string, Name?: string | null, Message?: string | null }> | null };

export type AddMessageMutationVariables = Exact<{
  keyword?: InputMaybe<Scalars['ID']>;
  message?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage?: { __typename?: 'message', Keyword: string, Message?: string | null, Name?: string | null } | null };

export type DeleteMessageMutationVariables = Exact<{
  keyword?: Scalars['ID'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage?: { __typename?: 'message', Keyword: string, Message?: string | null, Name?: string | null } | null };


export const GetMessageDocument = gql`
    query getMessage($keyword: ID = "") {
  getMessage(Keyword: $keyword) {
    Keyword
    Message
    Name
  }
}
    `;

/**
 * __useGetMessageQuery__
 *
 * To run a query within a React component, call `useGetMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageQuery({
 *   variables: {
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useGetMessageQuery(baseOptions?: Apollo.QueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
      }
export function useGetMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
        }
export type GetMessageQueryHookResult = ReturnType<typeof useGetMessageQuery>;
export type GetMessageLazyQueryHookResult = ReturnType<typeof useGetMessageLazyQuery>;
export type GetMessageQueryResult = Apollo.QueryResult<GetMessageQuery, GetMessageQueryVariables>;
export const ListMessagesDocument = gql`
    query ListMessages {
  listMessages {
    Keyword
    Name
    Message
  }
}
    `;

/**
 * __useListMessagesQuery__
 *
 * To run a query within a React component, call `useListMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListMessagesQuery(baseOptions?: Apollo.QueryHookOptions<ListMessagesQuery, ListMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMessagesQuery, ListMessagesQueryVariables>(ListMessagesDocument, options);
      }
export function useListMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMessagesQuery, ListMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMessagesQuery, ListMessagesQueryVariables>(ListMessagesDocument, options);
        }
export type ListMessagesQueryHookResult = ReturnType<typeof useListMessagesQuery>;
export type ListMessagesLazyQueryHookResult = ReturnType<typeof useListMessagesLazyQuery>;
export type ListMessagesQueryResult = Apollo.QueryResult<ListMessagesQuery, ListMessagesQueryVariables>;
export const AddMessageDocument = gql`
    mutation AddMessage($keyword: ID = "", $message: String = null, $name: String = null) {
  addMessage(input: {Name: $name, Message: $message, Keyword: $keyword}) {
    Keyword
    Message
    Name
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      keyword: // value for 'keyword'
 *      message: // value for 'message'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($keyword: ID! = "") {
  deleteMessage(Keyword: $keyword) {
    Keyword
    Message
    Name
  }
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;