<template>
  <div class="uploader-wrapper">
    <div class="upload">
      <div class="table-responsive">
        <v-text-field
          :error="Boolean(violations)"
          :error-messages="violations?.message"
        ></v-text-field>
        <v-table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ $t("fileuploader.thumb") }}</th>
              <th>{{ $t("fileuploader.name") }}</th>
              <th>{{ $t("fileuploader.size") }}</th>
              <th>{{ $t("fileuploader.status") }}</th>
              <th>{{ $t("fileuploader.action") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!files.length">
              <td colspan="9">
                <div class="text-center p-5">
                  <label :for="name" class="btn btn-lg btn-primary">{{
                    $t("fileuploader.selectfiles")
                  }}</label>
                </div>
              </td>
            </tr>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{ index }}</td>
              <td>
                <img
                  v-if="file.thumb"
                  class="td-image-thumb"
                  :src="file.thumb"
                />
                <span v-else>No Image</span>
              </td>
              <td>
                <div class="filename">
                  {{ file.name }}
                </div>
              </td>
              <td v-if="file.size">{{ formatSize(file.size) }}</td>
              <td v-if="file.error">{{ file.error }}</td>
              <td v-else-if="file.success">{{ $t("fileuploader.success") }}</td>
              <td v-else-if="file.active">{{ $t("fileuploader.active") }}</td>
              <td v-else></td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-secondary btn-sm dropdown-toggle"
                    type="button"
                  >
                    {{ $t("fileuploader.action") }}
                  </button>
                  <div class="dropdown-menu">
                    <a
                      v-if="
                        file.error &&
                        file.error !== 'compressing' &&
                        file.error !== 'image parsing' &&
                        upload.features.html5
                      "
                      class="dropdown-item"
                      href="#"
                      @click.prevent="
                        upload.update(file, {
                          active: true,
                          error: '',
                          progress: '0.00',
                        })
                      "
                      >{{ $t("fileuploader.retry") }}</a
                    >
                    <a
                      v-else
                      :class="{
                        'dropdown-item': true,
                        disabled:
                          file.success ||
                          file.error === 'compressing' ||
                          file.error === 'image parsing',
                      }"
                      href="#"
                      @click.prevent="
                        file.success ||
                        file.error === 'compressing' ||
                        file.error === 'image parsing'
                          ? false
                          : upload.update(file, { active: true })
                      "
                      >{{ $t("fileuploader.upload") }}</a
                    >

                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="upload.remove(file)"
                      >{{ $t("fileuploader.remove") }}</a
                    >
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div class="example-footer">
        <v-btn color="green">
          <VueUploadComponent
            ref="upload"
            v-model="files"
            :drop="true"
            :drop-directory="true"
            :custom-action="uploadFile"
            @input-filter="inputFilter"
            @input-file="inputFile"
          >
            <i class="fa fa-plus"></i>
            {{ $t("fileuploader.select") }}
          </VueUploadComponent>
        </v-btn>
        <v-btn
          v-show="!upload || !upload.active"
          @click.prevent="upload.active = true"
        >
          {{ $t("fileuploader.startupload") }}
        </v-btn>
        <v-btn
          v-show="upload && upload.active"
          @click.prevent="upload.active = false"
        >
          Stop upload
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueUploadComponent, { VueUploadItem } from "vue-upload-component";
import { ref } from "vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import Compressor from "compressorjs";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps<{
  hasEmit?: boolean;
}>();

const emit = defineEmits<{
  (e: "sendResource", value: any): void;
}>();

const files: Ref<VueUploadItem[]> = ref([]);
const upload = ref();
const name = ref();
const autoCompress = 1024 * 1024;
function inputFilter(
  newFile: VueUploadItem,
  oldFile: VueUploadItem | undefined,
  prevent: () => void,
) {
  if (newFile && newFile.name && !oldFile) {
    if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
      return prevent();
    }

    if (
      /\.(php5?|html?|jsx?)$/i.test(newFile.name) &&
      newFile.type !== "text/directory"
    ) {
      return prevent();
    }
  }

  if (
    newFile &&
    newFile.error === "" &&
    newFile.file &&
    newFile.type &&
    (!oldFile || newFile.file !== oldFile.file)
  ) {
    newFile.blob = "";
    let URL = window.URL || window.webkitURL;
    if (URL) {
      newFile.blob = URL.createObjectURL(newFile.file);
    }

    // Thumbnails
    // 缩略图
    newFile.thumb = "";
    if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
      newFile.thumb = newFile.blob;
    }
  }
}

// add, update, remove File Event
function inputFile(newFile: VueUploadItem, oldFile?: VueUploadItem) {
  if (newFile && oldFile) {
    // update

    if (newFile.progress !== oldFile.progress) {
      // progress
    }

    if (newFile.error && !oldFile.error) {
      // error
    }

    if (newFile.success && !oldFile.success) {
      // success
    }
  }

  if (!newFile && oldFile) {
    // remove
    if (oldFile.success && oldFile.response?.id) {
      // $.ajax({
      //   type: 'DELETE',
      //   url: '/upload/delete?id=' + oldFile.response.id,
      // })
    }
  }
}
function formatSize(size: number) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " KB";
  }
  return size.toString() + " B";
}
const mediaObjectCreateStore = useMediaObjectCreateStore();
const { violations } = storeToRefs(mediaObjectCreateStore);
async function uploadFile(newFile: VueUploadItem) {
  const formData = new FormData();
  if (
    newFile.file &&
    newFile.size &&
    autoCompress > 0 &&
    autoCompress < newFile.size
  ) {
    newFile.error = t("fileuploader.compressing");
    new Compressor(newFile.file, {
      maxWidth: 512,
      maxHeight: 512,

      success(result) {
        formData.set("file", result);
        newFile.error = undefined;
        newFile.success = true;
        newFile.size = result.size;

        files.value.forEach((file, index) => {
          if (file.name === newFile.name) {
            files.value[index] = newFile;
          }
        });
        uploader(formData);
      },
      error(err) {
        newFile.error = err.message;
        console.log(err.message);
      },
    });
  } else {
    newFile.file ? formData.set("file", newFile.file) : null;
    uploader(formData);
  }
  return newFile;
}

async function uploader(formData: FormData) {
  await mediaObjectCreateStore.create(formData);
  if (props.hasEmit) {
    emit("sendResource", mediaObjectCreateStore.created);
  }
}
</script>

<style>
.uploader-wrapper .btn-group .dropdown-menu {
  display: block;
  visibility: hidden;
  transition: all 0.2s;
}
.uploader-wrapper .btn-group:hover > .dropdown-menu {
  visibility: visible;
}

.uploader-wrapper label.dropdown-item {
  margin-bottom: 0;
}

.uploader-wrapper .btn-group .dropdown-toggle {
  margin-right: 0.6rem;
}

.td-image-thumb {
  max-width: 4em;
  max-height: 4em;
}

.uploader-wrapper .filename {
  margin-bottom: 0.3rem;
}

.uploader-wrapper .btn-is-option {
  margin-top: 0.25rem;
}
.uploader-wrapper .example-footer {
  padding: 0.5rem 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.uploader-wrapper .edit-image img {
  max-width: 100%;
}

.uploader-wrapper .edit-image-tool {
  margin-top: 0.6rem;
}

.uploader-wrapper .edit-image-tool .btn-group {
  margin-right: 0.6rem;
}

.uploader-wrapper .footer-status {
  padding-top: 0.4rem;
}

.uploader-wrapper .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.uploader-wrapper .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
