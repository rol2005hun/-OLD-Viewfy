<template>
    <nav id="navigationBar">
        <router-link class="navigationBarLogo" to="/"><h1>Viewfy</h1></router-link>
            <div @click="changeTheme">
                <i class="fas fa-lightbulb" id="lightBulb" ></i>
            </div>
            <div class="navigationLinks">
                <p v-if="isLoggedIn">
                    <router-link to="/home">Főoldal</router-link>
                </p>

<!--                <p v-if="isLoggedIn">-->
<!--                    <router-link to="/explore">Felfedezés</router-link>-->
<!--                </p>-->

                <p v-if="isLoggedIn">
                    <router-link to="/profilesettings">Beállítások</router-link>
                </p>

                <p v-if="isLoggedIn">
                    <router-link to="/createpost">Bejegyzés</router-link>
                </p>

<!--                <p v-if="isLoggedIn">-->
<!--                    <router-link to="/createwhisper">Közeli</router-link>-->
<!--                </p>-->

<!--                <p v-if="isLoggedIn">-->
<!--                    <router-link to="/chat">Chat</router-link>-->
<!--                </p>-->

                <p v-if="!isLoggedIn">
                    <router-link to="/login">Bejelentkezés</router-link>
                </p>

                <p v-if="!isLoggedIn">
                    <router-link to="/register">Regisztráció</router-link>
                </p>

                <p v-if="isLoggedIn">
                    <router-link to="/profile">Profil</router-link>
                </p>

                <p v-if="isLoggedIn">
                    <a to="/logout" @click.prevent="logoutUser">Kijelentkezés</a>
                </p>
            </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solid from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(brands, solid);
export default {
    data() {
        return {
            lightModeEnabled: false,
        };
    },
    mounted: function () {
        // lekéri a témát a lokális tárhelyből
        this.getThemeFromLocalStorage();
    },
    computed: {
        ...mapGetters(['isLoggedIn'])
    },
    methods: {
        clearErrorMessages() {
        let focusedElement = document.getElementById('errorMessages');
        focusedElement.innerHTML = '';
        },
        // mindezek a mapActions és a fenti mapGetters megtalálható UserREST.js alatt a raktár mappában az ügyfél szülő könyvtár
        ...mapActions(['logout']),
        logoutUser() {
            this.logout();
        },

        getThemeFromLocalStorage: function() {
            // elmenti a témát lokálisan
            const currentTheme = localStorage.getItem('theme');

            if (currentTheme) {
                document.documentElement.setAttribute('data-theme', currentTheme);
                this.lightModeEnabled = true;
                if (currentTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', currentTheme);
                    this.lightModeEnabled = false;
                }
            }
        },
        changeTheme: function() {
            if(this.lightModeEnabled) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                this.lightModeEnabled = false;
            } else if(!this.lightModeEnabled) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                this.lightModeEnabled = true;
            }
        },
    }
}
</script>

<style>

</style>
