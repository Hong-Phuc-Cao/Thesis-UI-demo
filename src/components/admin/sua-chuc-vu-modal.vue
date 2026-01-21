<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa chức vụ</h2>
                <label>
                    Tên chức vụ:
                    <input v-model="TenCV" type="text">
                </label>
                <label>
                    Số tiết được miễn:
                    <input v-model="SoTietMien" min="0" type="number">
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
        chucVu: Object,
    },

    data() {
        return {
            MaCV: "",
            TenCV: "",
            SoTietMien: "",
        }
    },

    watch:{
        chucVu:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.TenCV = newVal.TenCV || ""
                    this.SoTietMien = newVal.SoTietMien || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const chucVuDaSua = {
                MaCV: this.chucVu.MaCV,
                TenCV: this.TenCV,
                SoTietMien: this.SoTietMien
            }
            this.$emit('save', chucVuDaSua)
        }
    },
}
</script>