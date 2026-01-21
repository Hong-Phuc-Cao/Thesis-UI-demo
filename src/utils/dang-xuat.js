import axios from 'axios'
import router from '../routes/routes'
import {API_BASE_URL} from '../config'
const dangXuat = {
    async dangXuat(){
        try{
            const res = await axios.post(`${API_BASE_URL}/dang-nhap/xoa-thong-tin-session`,{},
                {
                withCredentials: true
            })
            if(res.data.success){
                router.push('/login')
            }else console.log('Lỗi đăng xuất: ', res.data.message);
        }catch(error){
            console.error('Lỗi khi đăng xuất:', error);
            throw error
        }

    }
}
// withCredentials là đối số thứ ba của axios.post, đối số thứ 2 là req.body
// vì vậy để dấu {} thay cho req.body
export default dangXuat