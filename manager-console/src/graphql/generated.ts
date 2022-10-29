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

export type ActiveUser = {
  __typename?: 'ActiveUser';
  ActiveUsers?: Maybe<Array<Scalars['String']>>;
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
};

export type EasterEgg = {
  __typename?: 'EasterEgg';
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
  Message?: Maybe<Scalars['String']>;
  TargetUsers?: Maybe<Array<Scalars['String']>>;
};

export type EasterEggInput = {
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
  Message: Scalars['String'];
  TargetUsers?: InputMaybe<Array<Scalars['String']>>;
};

export type Message = {
  __typename?: 'Message';
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
  Message?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
};

export type MessageInput = {
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
  Message: Scalars['String'];
  Name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addEasterEgg?: Maybe<EasterEgg>;
  addMessage?: Maybe<Message>;
  deleteEasterEgg?: Maybe<EasterEgg>;
  deleteMessage?: Maybe<Message>;
};


export type MutationAddEasterEggArgs = {
  input: EasterEggInput;
};


export type MutationAddMessageArgs = {
  input: MessageInput;
};


export type MutationDeleteEasterEggArgs = {
  Keyword: Scalars['ID'];
};


export type MutationDeleteMessageArgs = {
  Keyword: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getActiveUsers?: Maybe<ActiveUser>;
  getEasterEgg?: Maybe<EasterEgg>;
  getMessage?: Maybe<Message>;
  listEasterEggs?: Maybe<Array<Maybe<EasterEgg>>>;
  listMessages?: Maybe<Array<Message>>;
};


export type QueryGetActiveUsersArgs = {
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
};


export type QueryGetEasterEggArgs = {
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
};


export type QueryGetMessageArgs = {
  Keyword: Scalars['ID'];
  Kind: Scalars['ID'];
};

export type GetMessageQueryVariables = Exact<{
  Keyword?: InputMaybe<Scalars['ID']>;
}>;


export type GetMessageQuery = { __typename?: 'Query', getMessage?: { __typename?: 'Message', Keyword: string, Message?: string | null, Name?: string | null } | null };

export type ListMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListMessagesQuery = { __typename?: 'Query', listMessages?: Array<{ __typename?: 'Message', Keyword: string, Name?: string | null }> | null };

export type GetEasterEggQueryVariables = Exact<{
  Keyword?: InputMaybe<Scalars['ID']>;
}>;


export type GetEasterEggQuery = { __typename?: 'Query', getEasterEgg?: { __typename?: 'EasterEgg', Keyword: string, TargetUsers?: Array<string> | null, Message?: string | null } | null };

export type ListEasterEggsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListEasterEggsQuery = { __typename?: 'Query', listEasterEggs?: Array<{ __typename?: 'EasterEgg', Keyword: string } | null> | null };

export type GetActiveUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveUsersQuery = { __typename?: 'Query', getActiveUsers?: { __typename?: 'ActiveUser', ActiveUsers?: Array<string> | null } | null };

export type AddMessageMutationVariables = Exact<{
  Keyword?: InputMaybe<Scalars['ID']>;
  Message?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage?: { __typename?: 'Message', Keyword: string, Message?: string | null, Name?: string | null } | null };

export type AddEasterEggMutationVariables = Exact<{
  Keyword?: InputMaybe<Scalars['ID']>;
  Message?: InputMaybe<Scalars['String']>;
  TargetUsers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type AddEasterEggMutation = { __typename?: 'Mutation', addEasterEgg?: { __typename?: 'EasterEgg', Keyword: string, Message?: string | null, TargetUsers?: Array<string> | null } | null };

export type DeleteMessageMutationVariables = Exact<{
  Keyword?: Scalars['ID'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage?: { __typename?: 'Message', Keyword: string, Message?: string | null, Name?: string | null } | null };

export type DeleteEasterEggMutationVariables = Exact<{
  Keyword?: Scalars['ID'];
}>;


export type DeleteEasterEggMutation = { __typename?: 'Mutation', deleteEasterEgg?: { __typename?: 'EasterEgg', Keyword: string, Message?: string | null } | null };


export const GetMessageDocument = gql`
    query getMessage($Keyword: ID = "") {
  getMessage(Keyword: $Keyword, Kind: "Message") {
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
 *      Keyword: // value for 'Keyword'
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
    query listMessages {
  listMessages {
    Keyword
    Name
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
export const GetEasterEggDocument = gql`
    query getEasterEgg($Keyword: ID = "") {
  getEasterEgg(Keyword: $Keyword, Kind: "EasterEgg") {
    Keyword
    TargetUsers
    Message
  }
}
    `;

/**
 * __useGetEasterEggQuery__
 *
 * To run a query within a React component, call `useGetEasterEggQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEasterEggQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEasterEggQuery({
 *   variables: {
 *      Keyword: // value for 'Keyword'
 *   },
 * });
 */
export function useGetEasterEggQuery(baseOptions?: Apollo.QueryHookOptions<GetEasterEggQuery, GetEasterEggQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEasterEggQuery, GetEasterEggQueryVariables>(GetEasterEggDocument, options);
      }
export function useGetEasterEggLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEasterEggQuery, GetEasterEggQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEasterEggQuery, GetEasterEggQueryVariables>(GetEasterEggDocument, options);
        }
export type GetEasterEggQueryHookResult = ReturnType<typeof useGetEasterEggQuery>;
export type GetEasterEggLazyQueryHookResult = ReturnType<typeof useGetEasterEggLazyQuery>;
export type GetEasterEggQueryResult = Apollo.QueryResult<GetEasterEggQuery, GetEasterEggQueryVariables>;
export const ListEasterEggsDocument = gql`
    query listEasterEggs {
  listEasterEggs {
    Keyword
  }
}
    `;

/**
 * __useListEasterEggsQuery__
 *
 * To run a query within a React component, call `useListEasterEggsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListEasterEggsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListEasterEggsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListEasterEggsQuery(baseOptions?: Apollo.QueryHookOptions<ListEasterEggsQuery, ListEasterEggsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListEasterEggsQuery, ListEasterEggsQueryVariables>(ListEasterEggsDocument, options);
      }
export function useListEasterEggsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListEasterEggsQuery, ListEasterEggsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListEasterEggsQuery, ListEasterEggsQueryVariables>(ListEasterEggsDocument, options);
        }
export type ListEasterEggsQueryHookResult = ReturnType<typeof useListEasterEggsQuery>;
export type ListEasterEggsLazyQueryHookResult = ReturnType<typeof useListEasterEggsLazyQuery>;
export type ListEasterEggsQueryResult = Apollo.QueryResult<ListEasterEggsQuery, ListEasterEggsQueryVariables>;
export const GetActiveUsersDocument = gql`
    query getActiveUsers {
  getActiveUsers(Keyword: "ActiveUsers", Kind: "SystemInformation") {
    ActiveUsers
  }
}
    `;

/**
 * __useGetActiveUsersQuery__
 *
 * To run a query within a React component, call `useGetActiveUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
      }
export function useGetActiveUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveUsersQuery, GetActiveUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveUsersQuery, GetActiveUsersQueryVariables>(GetActiveUsersDocument, options);
        }
export type GetActiveUsersQueryHookResult = ReturnType<typeof useGetActiveUsersQuery>;
export type GetActiveUsersLazyQueryHookResult = ReturnType<typeof useGetActiveUsersLazyQuery>;
export type GetActiveUsersQueryResult = Apollo.QueryResult<GetActiveUsersQuery, GetActiveUsersQueryVariables>;
export const AddMessageDocument = gql`
    mutation AddMessage($Keyword: ID = "", $Message: String = "", $Name: String = "") {
  addMessage(
    input: {Name: $Name, Kind: "Message", Message: $Message, Keyword: $Keyword}
  ) {
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
 *      Keyword: // value for 'Keyword'
 *      Message: // value for 'Message'
 *      Name: // value for 'Name'
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
export const AddEasterEggDocument = gql`
    mutation AddEasterEgg($Keyword: ID = "", $Message: String = "", $TargetUsers: [String!] = []) {
  addEasterEgg(
    input: {TargetUsers: $TargetUsers, Kind: "EasterEgg", Message: $Message, Keyword: $Keyword}
  ) {
    Keyword
    Message
    TargetUsers
  }
}
    `;
export type AddEasterEggMutationFn = Apollo.MutationFunction<AddEasterEggMutation, AddEasterEggMutationVariables>;

/**
 * __useAddEasterEggMutation__
 *
 * To run a mutation, you first call `useAddEasterEggMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEasterEggMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEasterEggMutation, { data, loading, error }] = useAddEasterEggMutation({
 *   variables: {
 *      Keyword: // value for 'Keyword'
 *      Message: // value for 'Message'
 *      TargetUsers: // value for 'TargetUsers'
 *   },
 * });
 */
export function useAddEasterEggMutation(baseOptions?: Apollo.MutationHookOptions<AddEasterEggMutation, AddEasterEggMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEasterEggMutation, AddEasterEggMutationVariables>(AddEasterEggDocument, options);
      }
export type AddEasterEggMutationHookResult = ReturnType<typeof useAddEasterEggMutation>;
export type AddEasterEggMutationResult = Apollo.MutationResult<AddEasterEggMutation>;
export type AddEasterEggMutationOptions = Apollo.BaseMutationOptions<AddEasterEggMutation, AddEasterEggMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($Keyword: ID! = "") {
  deleteMessage(Keyword: $Keyword) {
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
 *      Keyword: // value for 'Keyword'
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
export const DeleteEasterEggDocument = gql`
    mutation DeleteEasterEgg($Keyword: ID! = "") {
  deleteEasterEgg(Keyword: $Keyword) {
    Keyword
    Message
  }
}
    `;
export type DeleteEasterEggMutationFn = Apollo.MutationFunction<DeleteEasterEggMutation, DeleteEasterEggMutationVariables>;

/**
 * __useDeleteEasterEggMutation__
 *
 * To run a mutation, you first call `useDeleteEasterEggMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEasterEggMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEasterEggMutation, { data, loading, error }] = useDeleteEasterEggMutation({
 *   variables: {
 *      Keyword: // value for 'Keyword'
 *   },
 * });
 */
export function useDeleteEasterEggMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEasterEggMutation, DeleteEasterEggMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEasterEggMutation, DeleteEasterEggMutationVariables>(DeleteEasterEggDocument, options);
      }
export type DeleteEasterEggMutationHookResult = ReturnType<typeof useDeleteEasterEggMutation>;
export type DeleteEasterEggMutationResult = Apollo.MutationResult<DeleteEasterEggMutation>;
export type DeleteEasterEggMutationOptions = Apollo.BaseMutationOptions<DeleteEasterEggMutation, DeleteEasterEggMutationVariables>;