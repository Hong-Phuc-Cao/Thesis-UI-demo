<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa nhiệm vụ</h2>
                <label>
                    Tên nhiệm vụ:
                    <input v-model="TenNV" type="text">
                </label>
                <label>
                    Số tiết được miễn: 
                    <input v-model="SoTietMien" type="number">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="luu_thong_tin">Lưu</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/edit-modal.css' 
export default {
    props:{
        isOpen: Boolean,
        nhiemVu: Object,
    },

    data() {
        return {
            MaNV: "",
            TenNV: "",
            SoTietMien: ""
        }
    },

    watch:{
        nhiemVu:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.TenNV = newVal.TenNV || ""
                    this.SoTietMien = newVal.SoTietMien || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const nhiemVuDaSua = {
                MaNV: this.nhiemVu.MaNV,
                TenNV: this.TenNV,
                SoTietMien: this.SoTietMien
            }
            this.$emit('save', nhiemVuDaSua)
        }
    },
}
</script>

