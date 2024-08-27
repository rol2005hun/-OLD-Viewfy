import axios from 'axios';

const state = {
    reply: {},
    replies: {},
    status: '',
    error: null
};

const getters = {
    reply: state => state.reply,
    replies: state => state.replies,
    replyStatus: state => state.status,
    replyError: state => state.error
};

const actions = {
    // összes poszt lekérése
    async getAllReplies({ commit }) {
        try {
            commit('getAllRepliesRequest');
            let res = await axios.get(`/reply`);
            const replies = res.data.replies;
            commit('getAllRepliesInfo', replies);
            return res;
        } catch(err) {
            commit('getAllRepliesError', err);
        }
    },

    // komment válaszok lekérése
    async getCommentReplies({ commit }, commentId) {
        try {
            commit('getCommentRepliesRequest');
            let res = await axios.get(`/reply/comment-id/${commentId}`);
            const replies = res.data.replies;
            commit('getCommentRepliesInfo', replies);
            return res;
        } catch(err) {
            commit('getCommentRepliesError', err);
        }
    },

    // válasz készítése
    async postReply({ commit }, [comment, commentId]) {
        commit('createReplyRequest');
        try {
            let res = await axios.post(`/reply/comment-id/${commentId}`, comment);
            if(res.data.success !== undefined) {
                const reply = res.data.reply;
                commit('createReplySuccess', reply);
            }
            return res;
        } catch(err) {
            commit('createReplyError', err);
        }
    },

    async patchReply({commit}, [replyToPatch, replyId]) {
        try {
            commit('patchReplyRequest');
            let res = await axios.patch(`/reply/reply-id/` + replyId, replyToPatch);
            const comment = res.data.comment;
            commit('patchReplySuccess', comment);
            return res;
        } catch (err) {
            commit('patchReplyError', err)
        }
    },
};

// mutation
const mutations = {
    // összes válasz lekérése
    // összes poszt lekérése
    getAllRepliesRequest(state) {
        state.status = 'Töltés';
    },
    getAllRepliesInfo(state, replies) {
        state.replies = replies;
    },
    getAllRepliesError(state, error) {
        state.error = error.response.data.msg;
    },

    // válaszok lekérése
    getCommentRepliesRequest(state) {
        state.status = 'Töltés';
    },
    getCommentRepliesInfo(state, replies) {
        state.replies = replies;
    },
    getCommentRepliesError(state, error) {
        state.error = error.response.data.msg;
    },

    // válasz készítése
    createReplyRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },
    createReplySuccess(state) {
        state.error = null;
        state.status = 'Sikeres válasz készítés';
    },
    createReplyError(state, error) {
        state.error = error.response.data.msg;
    },
    patchReplyRequest(state) {
        state.error = null;
        state.status = 'Töltés';
    },

    patchReplySuccess(state) {
        state.error = null;
        state.status = 'Sikeres válasz frissítés';
    },

    patchReplyError(state, error) {
        state.error = error.response.data.msg;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
