export const resolvers = {
    Query: {
        job: () => ({
            id         : 'test-id',
            title      : 'The Title',
            description: 'The Description'
        })
    }
}
