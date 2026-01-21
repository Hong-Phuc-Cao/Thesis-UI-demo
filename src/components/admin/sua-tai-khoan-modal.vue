<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa mật khẩu</h2>
                <label>
                    Tên giáo viên:
                    <input disabled type="text" v-model="HoTenGV">
                </label>
                <label>
                    Mã giáo viên:
                    <input disabled type="text" v-model="MaGV">
                </label>
                <label>
                    Mật khẩu mới:
                    <input type="text" v-model="MatKhauMoi">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="luu_thong_tin" @keyup.enter="luu_thong_tin">
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';



export default {
    props: {
        isOpen: Boolean,
        taiKhoan: Object
    },

    data() {
        return {
            MaGV: "",
            HoTenGV: "",
            MatKhauMoi: "",
            MaQuyen: "",
            MatKhau: "", // Lưu mật khẩu cũ từ taiKhoan
            danhSachQuyen: []
        };
    },

    watch: {
        taiKhoan: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal) {
                    this.MaGV = newVal.MaGV || "";
                    this.HoTenGV = newVal.HoTenGV || "";
                    this.MaQuyen = newVal.MaQuyen || "";
                    this.MatKhau = newVal.MatKhau || ""; // Gán mật khẩu cũ từ taiKhoan
                } else {
                    this.MaGV = "";
                    this.HoTenGV = "";
                    this.MaQuyen = "";
                    this.MatKhau = "";
                }
            }
        }
    },

    methods: {

        lam_moi_form(){
          this.MatKhauMoi = ""
          this.MaQuyen = ""
        },

        // async demTaiKhoanAdmin() {
        //     try {
        //         const response = await axios.get(`http://localhost:3000/api/v1/nguoi-dung/dem-tai-khoan-admin`);
        //         if (response.data.success) {
        //             console.log('Số TK admin: ', response.data.data[0]['count (*)']);
        //             return  response.data.data[0]['count (*)'];
        //         }
        //         return 0;
        //     } catch (error) {
        //         console.error('Lỗi khi đếm tài khoản ADMIN:', error);
        //         Swal.fire('Lỗi', 'Không thể kiểm tra số lượng tài khoản ADMIN', 'error');
        //         return null;
        //     }
        // },

        async luu_thong_tin() {
            try {

                const result = await Swal.fire({
                    title: 'Xác nhận thay đổi',
                    text: `Bạn có chắc chắn muốn đổi thông tin của giáo viên ${this.HoTenGV} (${this.MaGV})?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Hủy',
                    reverseButtons: true
                });

                if (result.isConfirmed) {
                    let taiKhoanDangSua;
                    let message;

                    if (this.MatKhauMoi.trim() === '') {
                        this.$emit('close');
                    } else {
                        taiKhoanDangSua = {
                            MaGV: this.MaGV,
                            MatKhau: this.MatKhauMoi,
                        };
                        this.$emit('save', taiKhoanDangSua); // Phát sự kiện save-password-and-role
                    }
                    this.lam_moi_form();
                    this.$emit('close');
                }
            } catch (error) {
                console.error('Lỗi khi lưu thông tin:', error);
                Swal.fire('Lỗi', error.message === 'Password cannot be empty' ? 'Mật khẩu mới không được để trống' : 'Không thể lưu thông tin', 'error');
            }
        }
    }    
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

.edit-modal {
  background: white;
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

.edit-modal {
  background: white;
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

.edit-modal__content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-modal h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.5rem;
}

.edit-modal__content label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
  color: #34495e;
}

.edit-modal__content input,
.edit-modal__content select {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.edit-modal__content input:focus,
.edit-modal__content select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.modal-actions{
    display: flex;
    justify-content: space-between;
}

.edit-modal__content button {
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

.edit-modal__content button:hover:first-child{
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.edit-modal__content button:hover:last-child{
  background-color: green;
  color: white;
  border-color: green;
}
</style>