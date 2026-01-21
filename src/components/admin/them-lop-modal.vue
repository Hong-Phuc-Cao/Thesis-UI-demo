<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm lớp</h2>
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
                    Ký hiệu:
                    <select v-model="KyHieu" name="" id="">
                        <option disabled value="">-- Chọn ký hiệu --</option>
                        <option value="A">A</option>
                        <option value="P">P</option>
                    </select>
                </label>
                <label for="">
                    Nhập số lượng lớp:
                    <input v-model="SoLuong" type="number" min="1" placeholder="Nhập số lượng lớp muốn tạo">
                </label>
                <label for="">
                    Năm học:
                    <select v-model="namHocDuocChon" name="" id="">
                        <option disabled value="">-- Chọn năm học --</option>
                        <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                            {{nh.NamHoc}}
                        </option>
                    </select>
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_lop_hang_loat">Thêm</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {lay_nam_hoc} from '../../utils/lay_nam_hoc_va_hoc_ky'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean,
    },

    data(){
        return{
            MaGV: '',
            Khoi: '',
            KyHieu: '',
            SoLuong: 0,
            danhSachNamhoc: [],
            NamHoc: '',
            namHocDuocChon: '',
            duocThem: false,
            danhSachLopTheoKhoiVaKyHieu: [],
            tongLopTheoKhoiVaKyHieu: '',

        }
    },

    async created(){
        await this.lay_nam_hoc_va_hoc_ky()
        await this.hien_danh_sach_nam_hoc()
    },

    watch:{
        namHocDuocChon(newVal){
            const ketQua = so_sanh_nam_hoc(this.NamHoc, newVal)
            this.duocThem = ketQua == 'nam_hien_tai' || ketQua == 'nam_sau'
        }
    },

    methods:{
        async lay_nam_hoc_va_hoc_ky(){
            try{
                this.NamHoc = await lay_nam_hoc()
                this.HocKy = await lay_hoc_ky()
            }catch(error){
                console.log('Lỗi lấy năm học và học kỳ: ', error);
            }
        },

        async hien_danh_sach_nam_hoc(){
            try{
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if(response.data.success){
                    this.danhSachNamHoc = response.data.data
                }
            }catch(error){
                console.log(error);
                throw error
            }
        },

        async lay_danh_sach_lop_theo_khoi_va_ky_hieu(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/lop/danh-sach-lop-theo-khoi-va-ky-hieu?NamHoc=${this.namHocDuocChon}&Khoi=${this.Khoi}&KyHieu=${this.KyHieu}
                `)
                if(response.data.success){
                    this.danhSachLopTheoKhoiVaKyHieu = response.data.data
                    this.tongLopTheoKhoiVaKyHieu = response.data.tongLop

                    // console.log(response);
                    // console.log(this.danhSachLopTheoKhoiVaKyHieu);
                    // console.log('Tổng lớp từ res: ',this.tongLopTheoKhoiVaKyHieu);
                }
            }catch(error){
                console.log('Lỗi lấy danh sach lớp theo khối và ký hiệu: ', error);
            }
        },

        // tách lớp và tìm lớp để thêm hàng loạt, cách này k dùng nữa, để đó tham khảo

        // tach_sttlop(TenLop){
        //     const regular_expression = /^(\d{2})([AP])(\d{1,2})$/
        //     const match = TenLop.match(regular_expression)

        //     if(match){
        //         return parseInt(match[3], 10)
        //     }
        // },      

        // tim_sttlop_lon_nhat(danhSachLop){
        //     let highest = 0
        //     let index = 0
        //     let current = 0

        //     if(danhSachLop.length == 0) return 0

        //     for(index = 0; index < danhSachLop.length; index++){
        //         current = this.tach_sttlop(danhSachLop[index].TenLop)
        //         if(current != null && current > highest){
        //             highest = current
        //         }
        //     }
        //     return highest || 0
        // },

        async them_lop_hang_loat(){
            if(!this.Khoi || !this.KyHieu || this.SoLuong < 1){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            // console.log(this.namHocDuocChon);
            // console.log('NH hiện tại: ', this.NamHoc);
            if(!this.duocThem){
                Swal.fire({
                    title: "Thông tin không hợp lệ!",
                    text: "Vui lòng chọn năm học hợp lệ, không thể chọn năm học cũ",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            await this.lay_danh_sach_lop_theo_khoi_va_ky_hieu()
            // Xử lý thêm dữ liệu ngay trên modal thay vì gưi về component cha như những CRUD khác
            let response
            try{
                const start = this.tongLopTheoKhoiVaKyHieu + 1

                for(let i = start; i < start + this.SoLuong; i++){
                    const thongTinLop = {
                        STTLop: i,
                        Khoi: this.Khoi,
                        KyHieu: this.KyHieu,
                        NamHoc: this.namHocDuocChon,
                        MaGV: null
                    }
                    console.log(thongTinLop);
                    response = await axios.post(
                        `${API_BASE_URL}/lop/them-lop`,
                        thongTinLop
                    )
                }
                if(response.data.success){
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm thành công!',
                        text: 'Dữ liệu đã được thêm vào hệ thống.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        background: '#f0fff4',
                        iconColor: '#2ecc71',
                        customClass: {
                            popup: 'success-toast',
                            title: 'success-title',
                            content: 'success-content'
                        }
                    });
                    this.$emit('close')
                    this.lam_moi_form()
                }else 
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm thành công!',
                        text: 'Dữ liệu đã được thêm vào hệ thống.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        background: '#f0fff4',
                        iconColor: '#2ecc71',
                        customClass: {
                            popup: 'success-toast',
                            title: 'success-title',
                            content: 'success-content'
                        }
                    });                
            }catch(error){
                console.error(error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        },

        lam_moi_form(){
            this.Khoi = '',
            this.KyHieu = '',
            this.SoLuong = 0,
            this.namHocDuocChon = ''
        },
    },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Khung modal */
.add-modal {
  background: white;
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Nội dung modal */
.add-modal__content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
}

.add-modal h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.5rem;
}

/* Style chung cho các input */
.add-modal__content label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
  color: #34495e;
}

.add-modal__content input,
.add-modal__content select {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.add-modal__content input:focus,
.add-modal__content select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* Radio button group */
.gender-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 5px;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    margin: 0;
    width: auto;
}

/* Nút thêm và đóng */
.modal-actions{
    display: flex;
  justify-content: space-between;
}

.add-modal__content button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  align-self: flex-end;
}

.add-modal__content button:hover:first-child{
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.add-modal__content button:hover:last-child{
  background-color: green;
  color: white;
  border-color: green;
}

#search-button:hover,
#add-button:hover{
    background-color: #e9ecef;
    color: white;
    border-color: #e9ecef;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin: 10px 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
}

th, td {
    padding: 8px 7px;
    border: 1px solid #ccc;
    text-align: center;
}

th {
    background: linear-gradient(to bottom, #3c8dbc, #367fa9);
    color: white;
    font-weight: bold;
    font-size: 15px;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:nth-child(odd) {
    background-color: #ffffff;
}

.container__table button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin: 0 2px;
    transition: transform 0.2s ease;
}
</style>    