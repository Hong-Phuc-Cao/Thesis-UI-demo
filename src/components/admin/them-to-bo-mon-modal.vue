<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm tổ bộ môn</h2>
                <label>
                    Tên tổ bộ môn:
                    <input v-model="TenBM" type="text">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_to_bo_mon">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/create-modal.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean
    },

    data(){
        return{
            MaBM: "",
            TenBM: "",

        }
    },

    methods: {
        async tao_ma_to_bo_mon(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/bo-mon/danh-sach-bo-mon
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách tổ bộ môn");
                const danhSachTBM = response.data.data;
            
                let maxNumber = 0;
                danhSachTBM.forEach(mh => {
                    const match = mh.MaBM.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                    }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `BM00${newNumber}` : newNumber < 100 ? `BM0${newNumber}` : `BM${newNumber}`

            } catch (error) {
                console.error("Lỗi khi tạo mã tổ bộ môn:", error);
                return "BM001";
            }
        },

        async them_to_bo_mon(){
            if(!this.TenBM){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const maMoi = await this.tao_ma_to_bo_mon()
            const toBoMonMoi = {
                MaBM: maMoi,
                TenBM: this.TenBM,
            }
            this.$emit('save', toBoMonMoi)
        }
    },
}
</script>