import React from 'react';
import { Box, TextField, Button, FormControl, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import register from '../css/components/register.module.scss';

const Register = () => {
  const url = 'http://localhost:8000/register';
  const navigate = useNavigate();

  type Inputs = {
    email: string;
    password: string;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      alert("登録が成功しました。ログインしてください。");
      navigate("/login");
    } catch (error) {
      console.error("登録エラー:", error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <Box className={register.container}>
      <Typography variant="h5" className={register.title}>アカウント登録</Typography>

      <form onSubmit={handleSubmit(onSubmit)} className={register.form}>
        <FormControl fullWidth className={register.formControl}>
          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "無効なメールアドレスです",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="メールアドレス *"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth className={register.formControl}>
          <Controller
            control={control}
            name="password"
            defaultValue=""
            rules={{
              required: "パスワードは必須です",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="パスワード *"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
        </FormControl>

        <Button type="submit" variant="contained" className={register.button}>
          アカウント登録
        </Button>
      </form>
    </Box>
  );
};

export default Register;
