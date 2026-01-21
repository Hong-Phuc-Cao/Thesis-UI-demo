<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm chương trình</h2>
                <label for="">
                    Nhóm môn học: 
                    <select v-model="MaNhom" >
                        <option disabled value="">-- Chọn nhóm môn học --</option>
                        <option v-for="nhommon in danhSachNhomMonHoc" :key="nhommon.MaNhom" :value="nhommon.MaNhom">
                            {{nhommon.TenNhom}}
                        </option>
                    </select>
                </label>
                <label for="">
                    Môn học: 
                    <select v-model="MaMon" >
                        <option disabled value="">-- Chọn môn học --</option>
                        <option v-for="mon in danhSachMonHoc" :key="mon.MaMon" :value="mon.MaMon">
                            {{mon.TenMon}}
                        </option>
                    </select>
                </label>
                <label for="">
                    Khối:
                    <select v-model="Khoi" name="" id="">
                        <option disabled value="">-- Chọn khối --</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </label>                
                <label for="">
                    Học kỳ:
                    <select v-model="HocKy">
                        <option disabled value="">-- Chọn học kỳ --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>                    
                </label>                
                <label for="">
                    Số tiết trong tuần:
                    <input 
                        v-model="SoTietTuan" 
                        type="number" 
                        min="1" 
                        max="99" 
                        @keydown="kiem_tra_so_am"
                        @input="kiem_tra_so_tiet"
                    >
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_chuong_trinh">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import '@/assets/create-modal.css'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean,
    },

    data(){
        return{
            Khoi: "",
            MaNhom: "",
            HocKy: "",
            MaMon: "",
            SoTietTuan: "",
            danhSachNhomMonHoc: [],
            danhSachMonHoc: []
        }
    },

    async created(){
        await this.hien_danh_sach_nhom_mon_hoc()
        await this.hien_danh_sach_mon_hoc()
    },

    methods: {
        async hien_danh_sach_nhom_mon_hoc(){
            try{
                const response = await axios.get(`${API_BASE_URL}/nhom-mon-hoc/danh-sach-nhom-mon-hoc`)
                if(response.data.success){
                    this.danhSachNhomMonHoc = response.data.data
                }
                
            }catch(error){
                console.log('Lỗi lấy API ds nhóm môn:', error)
                throw error
            }
        },

        async hien_danh_sach_mon_hoc(){
            try{
                const response = await axios.get(`${API_BASE_URL}/mon-hoc/danh-sach-mon-hoc`)
                if(response.data.success){
                    this.danhSachMonHoc = response.data.data
                }
                
            }catch(error){
                console.log('Lỗi lấy API ds môn:', error)
                throw error
            }
        },

        kiem_tra_so_tiet(){
            if (this.SoTietTuan < 1) {
                this.SoTietTuan = 1;
            }
        },

        kiem_tra_so_am(e){
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
            }
        },

        clear_form(){
            this.Khoi = "",
            this.MaNhom = "",
            this.HocKy = "",
            this.MaMon = "",
            this.SoTietTuan = ""
        },

        them_chuong_trinh(){
            if (this.SoTietTuan <= 0) {
                Swal.fire({
                    title: "Số tiết không hợp lệ!",
                    text: "Số tiết trong tuần phải lớn hơn 0",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return;
            }            
            if(!this.HocKy || !this.Khoi || !this.MaMon || !this.MaNhom || !this.SoTietTuan){
                Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }

            const chuongTrinhMoi = {
                Khoi: this.Khoi,
                MaNhom: this.MaNhom,
                HocKy: this.HocKy,
                MaMon: this.MaMon,
                SoTietTuan: this.SoTietTuan
            }

            this.$emit('save', chuongTrinhMoi)
            this.clear_form()
        }
    },
    
}
</script>