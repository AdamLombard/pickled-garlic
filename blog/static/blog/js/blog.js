let index_app = new Vue({
  delimiters: ['${', '}$'],
  el: '#index_app',
  data: () => ({
    currentRoute: window.location.pathname,
    posts: [],
    comments: []
  }),

  methods: {
    getPosts() {
      axios.get(`http://localhost:8000/api/posts`)
      .then( response => {
        this.posts = response.data
      })
      .catch(e => {
        this.errors.push(e)
      });
    },
    newPost() {
      console.log("hello");
    },

    formatDate(theDate) {
      return moment(theDate).format('MMMM Do YYYY, h:mm:ss a');
    },

    formatText(theText) {
      return theText.split(/\n/);
    }
  },

  mounted() {
    this.getPosts();
  }
});
