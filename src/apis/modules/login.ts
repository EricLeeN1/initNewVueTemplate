import request from '@/utils/axios';

interface IResponseType<P = object> {
    code?: number;
    status: number;
    msg: string;
    data: P;
}
interface ILogin {
    token: string;
    expires: number;
}

export const Login = (username: string, password: string) =>
    request<IResponseType<ILogin>>({
        url: '/api/auth/login',
        method: 'post',
        data: {
            username,
            password,
        },
    });
