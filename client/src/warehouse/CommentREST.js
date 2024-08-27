import axios from 'axios';

const state = {
    comment: {},
    comments: {},
    status: '',
    error: null
};

const getters = {
    comment: state => state.comment,
    comments: state => state.comments,
    commentStatus: state => state.status,
    commentError: state => state.error
};

const actions = {

    // egy komment lekérése az id alapján
    async getComment({commit}, id) {
        try {
            // /comment/comment-id/
            commit('getCommentRequest');
            let res = await axios.get(`/comment/comment-id/` + id);
            const comment = res.data.comment;
            commit('getCommentInfo', comment);
            return res;
        } catch (err) {
            commit('getCommentError', err);
        }
    },
    // összes komment lekérése a poszthoz
    async getPostComments({commit}, id) {
        try {
            // `/comment/post-id/${id}`
            commit('getPostCommentsRequest');
            let res = await axios.get(`/comment/post-id/` + id);
            const comments = res.data.comments;
            commit('getPostCommentsInfo', comments);
            return res;
        } catch (err) {
            commit('getPostCommentsError', err);
        }
    },

    async deleteComment({commit}, id) {
        try {
            // `/comment/comment-id/${id}`
            commit('deleteCommentRequest');
            let res = await axios.delete(`/comment/comment-id/${id}`);
            const comments = res.data.comments;
            commit('deleteCommentInfo', comments);
            return res;
        } catch (err) {
            commit('deleteCommentError', err);
        }
    },
    // komment készítése
    async postComment({commit}, [comment, postId]) {
        commit('createCommentRequest');
        try {
            let res = await axios.post(`/comment/post-id/${postId}`, comment);
            // értékelés max 1 felhasználókként
            if (res.data.success !== undefined) {
                const comment = res.data.comment;
                commit('createCommentSuccess', comment);
            }
            return res;
        } catch (err) {
            commit('createCommentError', err);
        }
    },

    async patchComment({commit}, [commentToPatch, commentId]) {
        try {
            commit('patchCommentRequest');
            let res = await axios.patch(`/comment/comment-id/` + commentId, commentToPatch);
            const comment = res.data.comment;
            commit('patchCommentSuccess', comment);
            return res;
        } catch (err) {
            commit('patchCommentError', err);
        }
    },


};

// mutation
const mutations = {
    getPostCommentsRequest(state) {
        state.status = 'Töltés';
    },
    getPostCommentsInfo(state, comments) {
        state.comments = comments;
    },
    getPostCommentsError(state, error) {
        state.error = error.response.data.msg;
    },

    // id szerint
    getCommentRequest(state) {
        state.status = 'Töltés';
    },
    getCommentInfo(state, comment) {
        state.comment = comment;
    },
    getCommentError(state, error) {
        state.error = error.response.data.msg;
    },

    // komment törlés
    deleteCommentRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },

    deleteCommentInfo(state, comments) {
        state.comments = comments;
    },

    deleteCommentError(state, error) {
        state.error = error.response.data.msg;
    },

    // komment készítés
    createCommentRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },
    createCommentSuccess(state) {
        state.error = null;
        state.status = 'Sikeres komment készítés';
    },
    createCommentError(state, error) {
        state.error = error.response.data.msg;
    },

    patchCommentRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },

    patchCommentSuccess(state) {
        state.error = null;
        state.status = 'Sikeres komment frissítés';
    },

    patchCommentError(state, error) {
        state.error = error.response.data.msg;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
