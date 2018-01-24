let vm = new Vue({
  el: '#new_post_app',
  data: {
    new_post:{
      title: '',
      author: '',
      text: ''
    }
  },

  methods: {
    submitNewPost() {
      axios.post(`/api/posts/`, this.new_post)
      .then( response => {
        console.log(response);
        window.location = `/posts/${response.data.id}`
      })
      .catch( e => {
        console.log(e);
      });
    }
  }
});