import { Box, TextField, Button, FormControl, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import styles from '../css/components/register.module.scss';

const Register = () => {
  const url = 'http://localhost:8000/api/auth/register';
  const navigate = useNavigate();

  type Inputs = {
    username: string;
    email: string;
    password: string;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      alert("登録が成功しました。ログインしてください。");
      navigate("/auth/login");
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
        アカウント登録
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* ユーザ名の入力フィールド */}
        <FormControl
          error={!!errors.username}
          fullWidth
          sx={{ mb: 3, mt: 2}} // フィールド間のマージン
        >
          <Controller
            control={control}
            name="username"
            defaultValue=""
            rules={{
              required: "ユーザ名は必須です",
              minLength: { value: 3, message: "ユーザ名は3文字以上で入力してください" }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                fullWidth
                required
                label="ユーザ名 *"
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
        </FormControl>

        {/* メールアドレスとパスワードのフィールド */}
        {["email", "password"].map((elem) => (
          <FormControl
            error={!!errors[elem as keyof Inputs]}
            key={elem}
            fullWidth
            sx={{ mb: 3 }}
          >
            <Controller
              control={control}
              name={elem as keyof Inputs}
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
                  error={!!errors[elem as keyof Inputs]}
                  helperText={errors[elem as keyof Inputs]?.message}
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
            mt: 2,
          }}
        >
          アカウント登録
        </Button>
      </form>

      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
        className={styles.toLogin}
      >
        <p>アカウントをお持ちでしたか？</p>
        <Link to="../login" style={{ color: '#1a73e8', textDecoration: 'none' }}>
          ログイン画面に戻る
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
