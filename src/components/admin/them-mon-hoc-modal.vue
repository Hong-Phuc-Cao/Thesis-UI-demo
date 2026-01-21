<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm môn học</h2>
                <label>
                    Tên môn học:
                    <input v-model="TenMon" type="text">
                </label>
                <label for="">
                    Tổ bộ môn:
                    <select name="" id="" v-model="MaBM">
                        <option value="" disabled>-- Chọn tổ bộ môn --</option>
                        <option v-for="tbm in danhSachBoMon" .value="tbm.MaBM" .key="tbm.TenBM">
                            {{tbm.TenBM}}
                        </option>
                    </select>
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_mon_hoc">Thêm</button>
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

    data() {
        return {
            MaMon: "",
            TenMon: "",
            MaBM: "",
            danhSachBoMon: [],
        }
    },

    async created(){
        this.hien_danh_sach_bo_mon()
    },

    methods: {
        async hien_danh_sach_bo_mon(){
            try{
              const response = await axios.get(`
                ${API_BASE_URL}/bo-mon/danh-sach-bo-mon
              `)
              if(response.data.success){
                this.danhSachBoMon = response.data.data
              }
            }catch(error){
                console.log('Lỗi hiện DS bộ môn')
                console.log(error)
            }
        },

        async tao_ma_mon(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/mon-hoc/danh-sach-mon-hoc
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách môn học");
                const danhSachMonHoc = response.data.data;
            
                let maxNumber = 0;
                danhSachMonHoc.forEach(mh => {
                    const match = mh.MaMon.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                    }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `MON0${newNumber}` : `MON${newNumber}`

            } catch (error) {
                console.error("Lỗi khi tạo mã môn học:", error);
                return "MON01";
            }
        },

        async them_mon_hoc(){
            if(!this.TenMon){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const maMoi = await this.tao_ma_mon()
            const monHocMoi = {
                MaMon: maMoi,
                TenMon: this.TenMon,
                MaBM: this.MaBM
            }
            this.$emit('save', monHocMoi)
        }
    },
}
</script>