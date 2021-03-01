import { TweenMax } from "gsap";

export default {
    data: () => ({
      loaded: [],
      ready: false,
      socket: undefined
    }),
    mounted() {
      if(this.$route.fullPath == '/admin') {
        this.socket = this.$nuxtSocket({
            name: 'home',
            channel: '/'
        })

        // this.socket.on('status', (data) => {
        //     console.log('status ',data)
        // })

        // this.socket.on('ping_response', (data) => {
        //     console.log('ping ',data)
        // })
      }
    },
    methods: {
        onView(id) {
          if (!this.loaded.includes(id)) {
            this.loaded.push(id);
            const el = document.getElementById(id);
            TweenMax.fromTo(
              el,
              0.5,
              { opacity: 0, marginTop: "50px", ease: Power2.easeInOut },
              { opacity: 1, marginTop: "0px", ease: Power2.easeInOut }
            );
          }
        }
    }
}