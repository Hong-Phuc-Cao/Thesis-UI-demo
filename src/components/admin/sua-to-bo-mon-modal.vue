<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa tổ bộ môn:</h2>
                <label>
                    Tên tổ bộ môn:
                    <input v-model="TenBM" type="text">
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
        toBoMon: Object,
    },

    data() {
        return {
            MaBM: "",
            TenBM: ""
        }
    },

    watch:{
        toBoMon:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.TenBM = newVal.TenBM || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const toBoMonDaSua = {
                MaBM: this.toBoMon.MaBM,
                TenBM: this.TenBM,
            }
            this.$emit('save', toBoMonDaSua)
        }
    },
}
</script>