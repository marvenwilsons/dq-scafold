import { TweenMax } from "gsap";

export default {
    data: () => ({
      loaded: [],
      ready: false,
      isauth: false,
      socket: undefined,
      mode: undefined,
      authorization: undefined,
      sampleListData: [
        {month: 'January', total: 1000},
        {month: 'February', total: 800},
        {month: 'April', total: 3000},
        {month: 'May', total: 3000},
        {month: 'June', total: 3000},
        {month: 'July', total: 3000},
        {month: 'August', total: 3000},
        {month: 'September', total: 3000},
        {month: 'November', total: 3000},
        {month: 'December', total: 3000},
      ]
    }),
    mounted() {
      // every axios request requires authorization headers
      this.authorization = {
        headers: {
          authorization: localStorage.getItem('token'),
        }
      }

      this.isauth = this.$store.state.isauth

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
      signout() {
        console.log('signing out')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        location.reload()
      },
      socketVerify(cb) {
        const token = localStorage.getItem('token')
        this.socket.emit('verify_token', token)
        this.socket.on('verify_token_response',(resp) => {
          if(resp === 'unauthorized') {
            cb('unauthorized',undefined)
          } else {
            cb(undefined,true)
          }
        })
      },
      axiosVerify(cb) {
        const token = localStorage.getItem('token')
        console.log('axios verify')
        this.$axios.get('/auth/verify', {
          headers: {
            authorization: token
          }
        }).then(res => {
          cb(undefined,res)
        }).catch(e => {
          cb(e,undefined)
        })
      },
      onView(id) {
        if (!this.loaded.includes(id)) {
          this.loaded.push(id);
          const el = document.getElementById(id);
          TweenMax.fromTo(
            el,
            0.7,
            { opacity: 0, marginTop: "50px", ease: Power2.easeInOut },
            { opacity: 1, marginTop: "0px", ease: Power2.easeInOut }
          );
        }
      },
      moneyFormater(value) {
        if(isNaN(value)) return '$0.00'

        var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        return formatter.format(value)
      }
    }
}