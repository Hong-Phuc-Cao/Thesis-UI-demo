<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa môn học</h2>
                <label>
                    Tên môn học:
                    <input v-model="TenMon" type="text">
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
        monHoc: Object,
    },

    data() {
        return {
            MaMon: "",
            TenMon: ""
        }
    },

    watch:{
        monHoc:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.TenMon = newVal.TenMon || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const monHocDaSua = {
                MaMon: this.monHoc.MaMon,
                TenMon: this.TenMon,
            }
            this.$emit('save', monHocDaSua)
        }
    },
}
</script>