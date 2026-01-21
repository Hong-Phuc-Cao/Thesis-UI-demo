<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa học kỳ</h2>
                <label>
                    Số tuần:
                    <input v-model="SoTuan" type="number" min="1">
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
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    props:{
        isOpen: Boolean,
        hocKy: Object,
    },

    data(){
        return{
            HocKy: "",
            SoTuan: "",

        }
    },

    watch:{
        hocKy:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.SoTuan = newVal.SoTuan || ""
                }
            }
        }
    },

    methods: {
        luu_thong_tin(){
            const hocKyDaChinhSua = {
                HocKy: this.hocKy.HocKy,
                SoTuan: this.SoTuan,
            }
            this.$emit('save', hocKyDaChinhSua)
        }
    },
}
</script>