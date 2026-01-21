<template>
    <div class="container">
        <h1>Sửa mật khẩu</h1>
        <div class="container__change-pw">
            <label for="">
                Mật khẩu hiện tại:
                <input v-model="matKhauHienTai" type="password" placeholder="">
            </label>

            <label for="">
                Mật khẩu mới:
                <input v-model="matKhauMoi1" type="text" placeholder="Nhập mật khẩu mới">
            </label>
            
            <label for="">
                Nhập lại mật khẩu mới:
                <input v-model="matKhauMoi2" type="text" placeholder="Nhập lại mật khẩu mới">
            </label>
            <p v-if="hienCanhBao">Mật khẩu xác nhận không trùng khớp</p>
            <div class="container__action">
                <button @click="luu_mat_khau">
                    Xác nhận
                </button>
            </div>        
        </div>

    </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
import dangXuat from '../../utils/dang-xuat'
import {API_BASE_URL} from '../../config'
export default {
    data(){
        return{
            MaGV: "",
            MaQuyen: "",
            matKhau: "",
            matKhauHienTai: "",
            matKhauMoi1: "",
            matKhauMoi2: "",
            hienCanhBao: false,
        }
    },

    async created() {
        await this.goi_api_lay_thong_tin_session()
    },

    watch:{
        matKhauMoi1:{
            handler(newVal){
                this.hienCanhBao = newVal !== this.matKhauMoi2
            }
        },

        matKhauMoi2:{
            handler(newVal){
                this.hienCanhBao = newVal !== this.matKhauMoi1
            }
        }
    },

    methods: {
        async goi_api_lay_thong_tin_session() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/dang-nhap/lay-thong-tin-session`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    this.MaGV = response.data.thongTinSession.MaGV;
                    this.MaQuyen = response.data.thongTinSession.MaQuyen;
                }
                //console.log("Thông tin từ session: ", response.data);
                //console.log("Thông tin từ session (sua-mat-khau):", this.MaGV, this.MaQuyen);
            } catch (error) {
                console.error("Lỗi gọi api lấy thông tin session", error);
                throw error;
            }
        },

        async kiem_tra_mat_khau(){
            const thongTinDangNhap = {
                MaGV: this.MaGV,
                MatKhau: this.matKhauHienTai
            }
            try{
                const response = await axios.post(`${API_BASE_URL}/dang-nhap/kiem-tra-dang-nhap`, 
                thongTinDangNhap,{
                    withCredentials: true
                })
                if(response.data.success){
                    return 1
                }else return 0
            }catch(error){
                if(error.response){
                    switch (error.response.status){
                        case 401: 
                            console.error(error);
                            Swal.fire("Lỗi!", "Sai mật khẩu");
                            break
                        case 404:
                            console.error(error);
                            Swal.fire("Lỗi!", "Tài khoản không tồn tại");
                            break
                        case 500:
                            console.error(error);
                            Swal.fire("Lỗi!", "Có lỗi từ phía server");
                            break
                        default: 
                            console.error(error);
                            Swal.fire("Lỗi!", "Có lỗi xảy ra");  
                    }
                }else{
                    Swal.fire("Lỗi!", "Không thể kết nối đến server")
                    console.log(error);
                } 
            }
        },

        async goi_api_tim_giao_vien(keyword){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/tim-giao-vien?keyword=${keyword}
                `)
                if(response.data.success){
                    return response.data.data[0].Mail
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách GV theo bộ môn:", error)
            }
        },

        async goi_api_gui_email(mail){
            const thongTin = {
                to: mail,
                subject: "Tài khoản và mật khẩu hệ thống",
                text: "Chào thầy/cô, đây là thông tin tài khoản của thầy/cô để đăng nhập vào hệ thống:",
                html:`
                    <div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                        <h2 style="color: #0066cc;">Thông tin tài khoản hệ thống</h2>
                        <p>Chào thầy/cô,</p>
                        <p>Đây là thông tin tài khoản sau khi thay đổi mật khẩu:</p>
                        <ul>
                            <li><strong>Mã giáo viên:</strong> ${this.MaGV}</li>
                            <li><strong>Mật khẩu:</strong> ${this.matKhauMoi1}</li>
                        </ul>
                        <p>Trân trọng,</p>
                        <p><strong>Ban quản trị hệ thống</strong></p>
                    </div>                
                `
            }
            try{
                const response = await axios.post(`${API_BASE_URL}/email/gui-email`, thongTin)
                if(response.data.success){
                    this.hienModalThem = false
                }
            }catch(error){
                console.log(error)
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi gửi email cho giáo viên mới")
            }
        },

        async luu_mat_khau(){
            if(this.hienCanhBao == false){
                const ketQuaKiemTraMatKhau = await this.kiem_tra_mat_khau()

                if(ketQuaKiemTraMatKhau == 1){
                    const data = {
                        MatKhau: this.matKhauMoi1
                    }
                    try{
                        const response = await axios.put(`${API_BASE_URL}/nguoi-dung/sua-nguoi-dung?MaGV=${this.MaGV}`,data)

                        if(response.data.success){
                            Swal.fire({
                                icon: 'success',
                                title: 'Đã sửa mật khẩu!',
                                text: 'Dữ liệu đã được cập nhật thành công.',
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
                            const email = await this.goi_api_tim_giao_vien(this.MaGV)
                            console.log(email);
                            this.goi_api_gui_email(email)
                            await dangXuat.dangXuat()
                            
                        }
                    }catch(error){
                        console.error("Lỗi khi cập nhật tài khoản: ", error)
                        console.log(this.MaGV);
                        console.log(data);
                        Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật dữ liệu!");
                    }
                }else{
                    console.log('Kết quả kiểm tra mk: ', ketQuaKiemTraMatKhau);
                }
            }else{
                console.log('Hiện cảnh báo: ', this.hienCanhBao);
            }
        }
    },
}
</script>

<style scoped>
.container {
    padding: 0px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 1200px;
    margin: 0 auto;
}

.container__change-pw {
    width: 100%;
    max-width: 600px;
    background-color: aliceblue;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

label {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-weight: 500;
    color: #34495e;
    font-size: 1.1rem;
}

input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s;
    width: 100%;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

p {
    margin: 0;
    color: #e74c3c;
    font-size: 0.9rem;
    text-align: center;
}

.container__action {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

button {
    margin-top: 0;
    padding: 12px 25px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
}

button:hover {
    background-color: #d4efdf;
    transform: translateY(-2px);
}
</style>