<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa nhóm môn học</h2>
                <label>
                    Tên môn học:
                    <input v-model="TenNhom" type="text">
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
        nhommonhoc: Object,
    },

    data() {
        return {
            MaNhom: "",
            TenNhom: ""
        }
    },

    watch:{
        nhommonhoc:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.TenNhom = newVal.TenNhom || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const nhomMonHocDaSua = {
                MaNhom: this.nhommonhoc.MaNhom,
                TenNhom: this.TenNhom,
            }
            this.$emit('save', nhomMonHocDaSua)
        }
    },
}
</script>