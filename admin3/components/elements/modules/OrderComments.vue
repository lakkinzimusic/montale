<template>
  <div :style="`height: ${height?height:'70vh'}`" id="comment_container" class="popout">
    <div id="mainfield" ref="mainfield">
      <v-container>
        <div v-for="comment in order.order_comments"
             :style="`text-align: ${user_id == comment.user_id?'right':'left'}`">
          <v-alert
            style="width: 80%; display: inline-block"
            :color="comment.action == 'action'?'orange darken-3':'blue darken-3'"
            dark
            text
            dense
          >
            <b>{{comment.user.username}}</b><br/>
            <v-layout>
              <div v-html="comment.comment"></div>
              <v-spacer>
              </v-spacer>
              {{$moment(Date.parse(comment.created_at)).fromNow()}}
            </v-layout>

          </v-alert>
        </div>
      </v-container>

    </div>
    <div id="controls">
      <form @submit.prevent="addComment()" ref="form" :disabled="!sending">
        <v-layout align-items-center>
          <v-flex>
            <v-text-field
              label="Введите сообщение..."
              single-line
              :hide-details="true"
              solo
              rounded
              class="my-3 mx-2"
              v-model="msg"
            >
              <div slot="append-outer">
                <v-btn class="mx-2" fab small dark color="blue" style="margin-top: -7px" @click.prevent="addComment()">
                  <v-icon dark style="font-size: 130%">fas fa-paper-plane</v-icon>
                </v-btn>
              </div>
            </v-text-field>
          </v-flex>
        </v-layout>
      </form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "OrderComments",
        props: ['order', 'height'],
        data() {
            return {
                msg: null,
                sending: false,
            }
        },
        computed: {
            user_id: function () {
                return this.$auth.$state.user.id
            },
        },
        methods: {
            async addComment(){
                this.sending = true;
                let obj = {
                    comment: this.msg,
                    action: 'message'
                };
                let res = await this.$axios.$post(`/api/order/orders/comment/${this.order.id}`, obj);
                res.user = this.$auth.$state.user;
                this.order.order_comments.push(res);
                this.msg = null;
                this.sending = false;
                let that = this;
                setTimeout(function(){
                    that.scrollToBottom();
                }, 500);
            },
            async reload(){
                let res = await this.$axios.$get(`/api/order/orders/comment/${this.order.id}`);
                this.$set(this.order, 'order_comments', res);
                let that = this;
                setTimeout(function(){
                    that.scrollToBottom();
                }, 500);
            },
            scrollToBottom(){
                this.$refs.mainfield.scrollTop = this.$refs.mainfield.scrollHeight;
            }
        },
        mounted() {
            this.scrollToBottom();
            let that = this;
            setInterval(function(){
                that.reload();
            }, 5000);
        }
    }
</script>

<style scoped>
  #mainfield {
    height: 100%;
    max-height: 100%;
    overflow-y: scroll;
  }

  #comment_container {
    display: flex;
    flex-direction: column;
    background: #f1f1f1;
  }
</style>
