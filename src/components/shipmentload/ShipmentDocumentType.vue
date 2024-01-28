<template>
  <v-container fluid class="load-sum-container">
    <v-row class="row-sum">
      <v-col cols="12">
        <h4>
          {{ $t("shipmentload.documentTitle") }}
        </h4>
      </v-col>
      <v-col cols="12">
        <div v-for="(item, index) in docTypeRef" :key="index">
          <v-row>
            <v-col col="11">
              <div class="doc-names">{{ item["value"] }}</div>
            </v-col>
            <v-col col="1">
              <v-text-field
                v-model="item['data']"
                variant="outlined"
                type="number"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { DocumentTypeEnum } from "@/types/document_type";
import { DocumentType } from "@/types/documenttype";
import * as enumHelper from "@/utils/enumHelper";
import { Ref } from "vue";
import { useCreateNewDocumentStore } from "@/store/shipmentload/newdocument";
import { ShipmentLoadType } from "@/types/shipment_load_type";

interface DocTypeRef {
  key: string;
  value: string;
  data: number;
}
const docTypes = enumHelper.getMap(DocumentTypeEnum);
const docTypeRef: Ref<DocTypeRef[]> = ref([]);

const props = defineProps<{
  itemDocuments?: DocumentType[];
  loadType: number;
}>();
const itemDocuments: Ref<DocumentType[]> = ref(props.itemDocuments || []);
const newDocumentStore = useCreateNewDocumentStore();
docTypes.forEach((doc) => {
  if (
    doc.value === DocumentTypeEnum.F &&
    props.loadType == ShipmentLoadType.DANGEROUS
  ) {
    docTypeRef.value.push({ key: doc.key, value: doc.value, data: 1 });
  } else if (
    doc.value === DocumentTypeEnum.F &&
    props.loadType != ShipmentLoadType.DANGEROUS
  ) {
    return;
  } else {
    docTypeRef.value.push({ key: doc.key, value: doc.value, data: 0 });
  }
});

onBeforeUnmount(() => {
  newDocumentStore.$reset();
});
async function savetoStore() {
  docTypeRef.value.forEach((doc) => {
    if (doc.data > 0) {
      const docType: Ref<DocumentType> = ref({});
      docType.value.name = doc.key;
      docType.value.quantity = +doc.data;
      itemDocuments.value.push(docType.value);
    }
  });
}
defineExpose({
  savetoStore,
});
</script>
<style lang="scss" scoped>
.doc-names {
  float: left;
  width: 120px;
  margin: 18px;
}
</style>
