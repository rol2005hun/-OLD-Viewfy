import axios from 'axios';

const state = {
    post: {},
    posts: {},
    userPosts: {},
    status: '',
    error: null
};

const getters = {
    post: state => state.post,
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    postStatus: state => state.status,
    postError: state => state.error
};

const actions = {
    // poszt készítés
    async post({ commit }, [post, id]) {
        commit('createPostRequest');
        try {
            let res = await axios.post(`/post/user-id/${id}`, post);
            if(res.data.success !== undefined) {
                const post = res.data.post;
                commit('createPostSuccess', post);
            }
            return res;
        } catch(err) {
            commit('createPostError', err);
        }
    },

    // posztok lekérése
    async getAllPosts({ commit }) {
        try {
            commit('getPostsRequest');
            let res = await axios.get(`/post`);
            const posts = res.data.posts;
            commit('getPostsInfo', posts);
            return res;
        } catch(err) {
            commit('getPostsError', err);
        }
    },

    // felhasználó posztja
    async getUserPosts({ commit }, userId) {
        try {
            commit('getUserPostsRequest');
            let res = await axios.get(`/post/user-id/${userId}`);
            const posts = res.data.posts;
            commit('getUserPostsInfo', posts);
            return res;
        } catch(err) {
            commit('getUserPostsError', err);
        }
    },

    async deletePost({commit}, id) {
        try {
            commit('deletePostRequest');
            let res = await axios.delete(`/post/post-id/` + id);
            const posts = res.data.posts;
            commit('deletePostInfo', posts);
            return res;
        } catch (err) {
            commit("deletePostError", err)
        }
    },

    async patchPost({ commit }, [postId, postBody]) {
        commit('patchPostRequest');
        try {
            let res = await axios.patch(`/post/post-id/${postId}`, postBody);
            if(res.data.success !== undefined) {
                const post = res.data.post;
                commit('patchPostSuccess', post);
            }
            return res;
        } catch(err) {
            commit('patchPostError', err);
        }
    },
};

// mutation
const mutations = {
    // összes poszt lekérése
    getPostsRequest(state) {
        state.status = 'Töltés';
    },
    getPostsInfo(state, posts) {
        state.posts = posts;
    },
    getPostsError(state, error) {
        state.error = error.response.data.msg;
    },

    // felhasználó posztjának lekérése
    getUserPostsRequest(state) {
        state.status = 'Töltés';
    },

    getUserPostsInfo(state, userPosts) {
        state.userPosts = userPosts;
    },

    getUserPostsError(state, error) {
        state.error = error.response.data.msg;
    },

    // poszt készítése
    createPostRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },
    createPostSuccess(state) {
        state.error = null;
        state.status = 'Post successfully added';
    },
    createPostError(state, error) {
        state.error = error.response.data.msg;
    },

    // poszt törlése
    deletePostRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },

    deletePostInfo(state, posts) {
        state.posts = posts;
    },

    deletePostError(state, error) {
        state.error = error.response.data.msg;
    },

    // poszt frissítése
    patchPostRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },

    patchPostSuccess(state, posts) {
        state.posts = posts;
    },

    patchPostError(state, error) {
        state.error = error.response.data.msg;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
