<template>
  <div class="m-chat-emoji">
    <div class="emoji-content">
      <div class="cnt">
        <span class="emoji-item" :class="{'pinup-item':item.type==='pinup'}" v-for="(item,index) in currEmoji.list" @click.stop="selectEmoji(item)" :key="index">
          <img :src="item.img">
        </span>
      </div>
    </div>
    <div class="emoji-channel">
      <span class="emoji-album" :class="{active: item.name==currAlbum}" v-for="(item,index) in emoji" @click.stop="selectAlbum(item)" :key="index">
        <img :src="item.album">
      </span>
     <!--  <span v-if="type==='session'" class="emoji-album" :class="{active: item.name==currAlbum}" v-for="(item,index) in pinup" @click.stop="selectAlbum(item)" :key="index">
        <img :src="item.album">
      </span> -->
    </div>
  </div>
</template>

<script>
import emojiObj from "@/configs/emoji";

function genEmojiList(type, emojiList) {
    let result = {};
    for (let name in emojiList) {
        let emojiMap = emojiList[name];
        let list = [];
        for (let key in emojiMap) {
            list.push({
                type,
                name,
                key,
                img: emojiMap[key].img
            });
        }
        if (list.length > 0) {
            result[name] = {
                type,
                name,
                list,
                album: list[0].img
            };
        }
    }
    return result;
}

export default {
    props: {
        type: String,
        scene: String,
        to: String
    },
    data() {
        return {
            currType: "emoji",
            currAlbum: "emoji"
        };
    },
    computed: {
        emoji() {
            return genEmojiList("emoji", emojiObj.emojiList);
        },
        pinup() {
            return genEmojiList("pinup", emojiObj.pinupList);
        },
        currEmoji() {
            if (this.currType === "emoji") {
                return this.emoji[this.currAlbum];
            } else if (this.currType === "pinup") {
                return this.pinup[this.currAlbum];
            }
            return [];
        }
    },
    methods: {
        selectAlbum(album) {
            this.currType = album.type;
            this.currAlbum = album.name;
        },
        selectEmoji(emoji) {
            if (this.currType === "emoji") {
                // 由触发父组件事件，增加表情文案
                this.$emit("add-emoji", emoji.key);
            } else if (this.currType === "pinup") {
                if (this.type === "session") {
                    this.$store.dispatch("sendMsg", {
                        type: "custom",
                        scene: this.scene,
                        to: this.to,
                        pushContent: "[贴图表情]",
                        content: {
                            type: 3,
                            data: {
                                catalog: this.currAlbum,
                                chartlet: emoji.key
                            }
                        }
                    });
                } else if (this.type === "chatroom") {
                    this.$store.dispatch("sendChatroomMsg", {
                        type: "custom",
                        pushContent: "[贴图表情]",
                        content: {
                            type: 3,
                            data: {
                                catalog: this.currAlbum,
                                chartlet: emoji.key
                            }
                        }
                    });
                }
                this.$emit("hide-emoji");
            }
        }
    }
};
</script>

<style>
  .m-chat-emoji {
    position: absolute;
    top: -300px;
    height: 300px;
    left: 10px;
    width:400px;
    border-top: 1px solid #ccc;
    background-color: #fff;
    border-radius: 4px;
    }
  .m-chat-emoji .emoji-channel {
      display: flex;
      position: relative;
      width: 100%;
      height: auto;
      box-sizing: border-box;
      background-color: #f0f3f5;
      vertical-align: middle;
      }
    .m-chat-emoji    .emoji-album {
        cursor: pointer;
        margin-right:10px;
        width: 30px;
        height: 30px;
        padding:6px;
        }
    .m-chat-emoji      img {
          margin: 0;
          display: block;
          width: inherit;
          height: inherit;
          vertical-align: middle;
        }
    .m-chat-emoji   .emoji-album.active {
          background-color: #ccc;
    }
    .m-chat-emoji  .emoji-content {
      position: relative;
      width: 100%;
      height: 258px;
      background-color: #f0f0f0;
      overflow-y: auto;
      }
      .m-chat-emoji  .cnt {
        position: relative;
        display: block;
        margin: 6px auto;
        text-align: left;
      }
     .m-chat-emoji   .emoji-item {
        display: inline-block;
        width: 28px;
        height: 28px;
        padding: 2px;
        vertical-align: middle;
        }
        /*border: 1px solid #fff;*/
        /*margin-left: -1px;*/
        /*margin-bottom: -1px;*/
      .m-chat-emoji   .emoji-item img {
          width: inherit;
          height: inherit;
        }

     .m-chat-emoji .pinup-item {
        width: 44px;
        height: 44px;
      }
    

</style>
