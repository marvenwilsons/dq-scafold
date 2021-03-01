const state = () => ({
    appTitle: undefined
})

export const getters ={}
export const mutations = {}
export const actions = {
    async nuxtServerInit ({commit,state},context) {
        console.log('Nuxt Server Init')
        state.appTitle = process.env.APP_TITLE
    }
}