<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm học kỳ</h2>
                <label>
                    Học kỳ:
                    <input v-model="HocKy" type="number" min="2">
                </label>
                <label>
                    Số tuần:
                    <input v-model="SoTuan" type="text">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_hoc_ky">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/create-modal.css'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    props:{
        isOpen: Boolean
    },

    data(){
        return{
            HocKy: "",
            SoTuan: "",

        }
    },

    methods: {
        async them_hoc_ky(){
            if(!this.HocKy || !this.SoTuan){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const hocKyMoi = {
                HocKy: this.HocKy,
                SoTuan: this.SoTuan,
            }
            this.$emit('save', hocKyMoi)
        }
    },
}
</script>