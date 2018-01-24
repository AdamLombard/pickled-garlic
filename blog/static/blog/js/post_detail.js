Vue.component('threaded-comments', {
  props: ['comments', 'reply', 'replyToComment', 'deleteComment', 'updateComment', 'formatDate'],
  template: `
    <section class="section">
    <div v-for="comment in comments">
      <ul>
        <li>
          <div>By: {{ comment.author }}</div>
          <div>On: {{ formatDate(comment.comment_date) }}</div>
          <div>
            <textarea class="textarea" v-model="comment.text"></textarea>
          </div>
          <button class="button" @click="updateComment(comment.id)">update</button>
          <button class="button" @click="deleteComment(comment.id)">delete</button>
          <button class="button" @click="comment.show_reply=!comment.show_reply">reply</button>

          <form v-show="comment.show_reply" @submit.prevent="replyToComment">
            <div>
              <label for="text">Share a thought on a thought :</label>
              <textarea class="textarea" v-model="reply.text"></textarea>
            </div>
            <div>
              <label for="author">Your Name :</label>
              <input class="input" type="text" v-model="reply.author">
            </div>
            <div>
              <button class="button" type="submit" @click="reply.parent_comment=comment.id">Submit</button>
            </div>
          </form>

          <threaded-comments :comments="comment.comments" :reply="reply" :reply-to-comment="replyToComment" :delete-comment="deleteComment" :update-comment="updateComment"
          :format-date="formatDate"></threaded-comments>
        </li>
      </ul>
    </div>
    </section>`
})

Vue.component('comment-form', {
  props: ['newcomment','submitComment'],
  template: `
    <div class="comments">
      <form @submit.prevent="submitComment">
        <div>
          <label for="text">Share a thought :</label>
          <div>
          <textarea class="textarea" v-model="newcomment.text"></textarea>
          </div>
        </div>
        <div>
          <label for="author"> Your name :</label>
          <input class="input" type="text" v-model="newcomment.author">
        </div>
        <div>
          <button class="button" type="submit">Submit</button>
        </div>
      </form>
    </div>`
})

let vm = new Vue({
  delimiters: ['${', '}$'],
  el: '#post_app',
  data: {
    post: [],
    comments: [],
    nestedComments: [],
    commentToDelete: '',
    new_comment: {
      author: '',
      text: '',
      parent_comment: 0
    },
    reply: {
      author: '',
      text: '',
      parent_comment: 0
    }
  },

  methods: {
    getPost() {
      axios.get(`/api${window.location.pathname}`)
      .then( (response) => {
        this.post = response.data;
        this.getComments();
      })
      .catch( (e) => {
        console.log(e);
        window.location = '/';
      });
    },

    getComments() {
      axios.get(`/api/comments/?parent_id=${this.post.id}`)
      .then( (response) => {
        this.comments = response.data;
        this.nestComments();
      })
      .catch( (e) => {
        console.log(e);
      })
    },

    nestComments() {
      let comments = this.comments,
          nestedComments = [];

      for (let comment of comments){
        function recurseTree(nestedComments, comment) {
          for (let nestedComment of nestedComments) {
            if (comment.parent_comment == nestedComment.id) {
              comment.show_reply = false;
              nestedComment.comments.push(comment);
              break;
            } else {
              recurseTree(nestedComment.comments, comment);
            }
          }
        }
        comment.comments = [];
        if (comment.parent_comment == 0) {
          comment.show_reply = false;
          nestedComments.push(comment);
        } else {
          recurseTree(nestedComments, comment);
        }
      }

      this.nestedComments = nestedComments;
    },

    submitComment() {
      var theComment = this.new_comment;
      this.createComment(theComment);
      this.new_comment.author = '';
      this.new_comment.text = '';
    },

    replyToComment() {
      console.log("hello...")
      var theComment = this.reply;
      this.createComment(theComment);
      this.reply.author = '';
      this.reply.text = '';
    },

    createComment(theComment) {
      axios.post(`/api/comments/`, {
        author: theComment.author,
        text: theComment.text,
        parent_post: this.post.id,
        parent_comment: theComment.parent_comment
      })
      .then( response => {
        console.log(response);
        this.getComments();
      })
      .catch( e => {
        console.log(e);
      })
    },

    deleteComment(commentToDelete) {
      console.log("deleting..." + commentToDelete);
      axios.delete(`/api/comments/${commentToDelete}`)
      .then( response => {
        console.log(response);
        this.getComments();
      })
      .catch( e => {
        console.log(e);
      })
    },

    updateComment(commentToUpdate) {
      console.log("updading... " + commentToUpdate);

      let newText = this.comments.find( c => { return c.id === commentToUpdate}).text;

      axios.patch(`/api/comments/${commentToUpdate}/`, {
        text: newText
      })
      .then( response => {
        console.log(response);
        this.getComments();
      })
      .catch( e => {
        console.log(e);
      })
    },

    formatDate(theDate) {
      return moment(theDate).format('MMMM Do YYYY, h:mm:ss a');
    },

    formatText(theText) {
      return theText.split(/\n/);
    }
  },

  mounted() {
    this.getPost();
  }
});