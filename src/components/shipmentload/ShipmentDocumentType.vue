<template>
  <v-container fluid class="load-sum-container">
    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      closable="true"
      >{{
    }}</v-alert>
    <v-row class="row-sum">
      <v-col cols="12">
        <h4>
          {{ $t("shipmentload.documentTitle") }}
        </h4>
      </v-col>
      <v-col cols="2">
        <div v-for="(item, index) in docTypeRef" :key="index">
          <div class="doc-names">{{ item.value }}</div>
          <v-text-field v-model="item.data" variant="outlined" type="number"/>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col cols="12" sm="6" md="6">
        <v-btn color="primary" variant="outlined">
          {{ $t("shipmentload.cancel") }}
        </v-btn>
        <v-btn color="primary" class="ml-2" @click="emitFinish">{{
          $t("shipmentload.continue")
        }}</v-btn>
      </v-col> -->
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import Loading from "@/components/common/Loading.vue";
import { DocumentTypeEnum } from "@/types/document_type";
import { DocumentType } from "@/types/documenttype";
import * as enumHelper from "@/utils/enumHelper";
import { Ref } from "vue";
import { useCreateNewDocumentStore } from "@/store/shipmentload/newdocument";

const docTypes = enumHelper.getMap(DocumentTypeEnum);
const docTypeRef: Ref<{}> = ref(
  docTypes.map((doc) => {
    return { ...doc, data: 0 };
  }),
);
const props = defineProps(["itemDocuments", "saveStore"]);
const itemDocuments: Ref<DocumentType[]> = ref(props.itemDocuments || []);
const newDocumentStore = useCreateNewDocumentStore();

onBeforeUnmount(() => {
  newDocumentStore.$reset();
});
function savetoStore() {
  docTypeRef.value.forEach((doc) => {
    if (doc.data > 0) {
      const docType: Ref<DocumentType> = ref({});
      docType.value.name = doc.key;
      docType.value.quantity = +doc.data;
      itemDocuments.value.push(docType.value);
    }
  });
}
watch(
  () => props.saveStore,()=>{
    if(props.saveStore){
    console.log("saveStore");
      savetoStore()
    }
  }
)
</script>
<style lang="scss" scoped>
.doc-names {
  float: left;
  width: 120px;
  margin: 18px;
}
</style>
