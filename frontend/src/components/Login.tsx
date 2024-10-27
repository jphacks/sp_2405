import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, TextField, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import styles from '../css/components/login.module.scss';

const Login = () => {
  const { handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Box
      height={500}
      width={400}
      bgcolor={"rgba(255, 255, 255, 1)"}
      borderRadius={2}
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h5" className={styles.title}>
        ログイン
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}// フォームの上のマージン
      >
        {["email", "password"].map((elem) => (
          <FormControl
            error={!!errors[elem]}
            key={elem}
            fullWidth
            sx={{ mb: 0, mt: 6}} // フィールド間のマージン
          >
            <Controller
              control={control}
              name={elem}
              defaultValue=""
              rules={{
                required: `${elem === "email" ? "メールアドレス" : "パスワード"}は必須です`,
                ...(elem === "email" && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "無効なメールアドレスです",
                  },
                }),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={elem === "email" ? "text" : "password"}
                  fullWidth
                  required
                  label={elem === "email" ? "メールアドレス *" : "パスワード *"}
                  error={!!errors[elem]}
                  helperText={errors[elem]?.message}
                />
              )}
            />
          </FormControl>
        ))}

        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: grey[900],
            ":hover": { bgcolor: grey[800] },
            width: "75%",
            mt: 6, // ボタンの上のマージン
          }}
        >
          ログイン
        </Button>
      </form>

      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 6,
        }}
        className={styles.toLogin}
      >
        <p>アカウントをお持ちでないですか？</p>
        <Link to="../register" style={{ color: '#1a73e8', textDecoration: 'none' }}>
          アカウント登録
        </Link>
      </Typography>


      {/* <Divider sx={{ my: 3 }} className={styles.divider}>
        または
      </Divider>

      <Button variant="outlined" fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img className={styles.logo} src="/img/google.png" alt="Google" style={{ marginRight: '8px', height: '20px' }} />
        Googleでログイン
      </Button> */}
    </Box>
  );
};

export default Login;
