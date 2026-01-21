<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa lớp học</h2>
                <label for="">
                    Tên lớp:
                    <input v-model="TenLop" disabled type="text">
                </label>
                <label for="">
                    GVCN:
                    <select v-model="MaGV" name="" id="">
                        <option disabled value="">-- Chọn GVCN --</option>
                        <option v-for="gv in danhSachGiaoVienChuNhiem" :key="gv.MaGV" :value="gv.MaGV">
                            {{gv.HoTenGV}}
                        </option>
                    </select>
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
import axios from 'axios'
import '@/assets/edit-modal.css'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean,
        Lop: Object,
    },

    data(){
        return{
            MaGV: '',
            danhSachGiaoVienChuNhiem: [],
            MaNV: 'NV006',
            NamHoc: '',
            TenLop: '',
            STTLop: '',
            Khoi: '',
            KyHieu: '',
        }
    },

    watch:{ 
        Lop:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.NamHoc = newVal.NamHoc || ''
                    this.TenLop = newVal.TenLop || ''
                    this.STTLop = newVal.STTLop || ''
                    this.KyHieu = newVal.KyHieu || ''
                    this.Khoi = newVal.Khoi || ''
                }
            }
        },
        isOpen(newVal) {
            if (newVal && this.NamHoc) {
                this.hien_danh_sach_giao_vien_chu_nhiem();
            } else {
                this.danhSachGiaoVienChuNhiem = []; // Reset khi modal đóng
            }
        },
    },

    methods: {
        async hien_danh_sach_giao_vien_chu_nhiem(){
            console.log('NamHoc:',this.NamHoc);
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/kiem-nhiem/danh-sach-giao-vien-chu-nhiem?MaNV=${this.MaNV}&NamHoc=${this.NamHoc}
                `)
                if(response.data.success){
                    this.danhSachGiaoVienChuNhiem = response.data.data
                }
            }catch(error){
                console.log('Lỗi lấy danh sách GVCN:', error);
            }
        },

        luu_thong_tin(){
            const request_body = {
                MaGV: this.MaGV
            }
            const request_query = {
                STTLop: this.STTLop,
                Khoi: this.Khoi,
                KyHieu: this.KyHieu,
                NamHoc: this.NamHoc
            }
            //console.log(request_body, request_query);
            this.$emit('save',{ request_body, request_query});
        }
    },
}
</script>