import { useContext } from "react";
import { Box, TextField, Button, FormControl } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  // const {CSRFToken, setCSRFToken} = useContext(CSRFTokenContext);
  const url = 'http://localhost:8000';

  type Inputs = {
    email: string;
    password: string;
  };

  // const [cred, setCred] = useState<UserCredential | undefined>(undefined);

  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    

    
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const margin = 2;
  const japanese = {
    email: "メールアドレス",
    password: "パスワード",
  };

  return (
    <Box
      height={640}
      width={500}
      bgcolor={"rgba(255, 255, 255, 1)"}
      borderRadius={2}
      p={8}
      display="flex"
      flexDirection={"column"}
      alignItems="center"
    >
      <h1 className={styles.title}>ログイン</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {["email", "password"].map((elem) => (
          <FormControl
            error={!!errors[elem as keyof Inputs]}
            key={elem}
            fullWidth
            sx={{ mb: margin }}
          >
            <Controller
              control={control}
              name={elem as keyof Inputs}
              defaultValue=""
              rules={{
                required: true,
                ...(elem === "email" && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "無効なメールアドレスです",
                  },
                }),
              }}
              render={({ field, formState: { errors } }) => (
                <TextField
                  {...field}
                  // variant="standard"
                  type={elem === "email" ? "normal" : "password"}
                  fullWidth
                  required
                  label={japanese[elem as keyof Inputs]}
                  error={!!errors[elem as keyof Inputs]}
                  helperText={errors[elem as keyof Inputs]?.message as string}
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
            // fontWeight: "bold",
            width: "75%",
          }}
        >
          ログイン
        </Button>
      </form>

      <div className={styles.toLogin}>
        <p>アカウントをお持ちでないですか？</p>
        <Link to="../signup">アカウント登録</Link>
      </div>

      <p className={styles.divider}>または</p>

      <div className={styles.socials}>
        <Button variant="outlined" fullWidth>
          <img className={styles.logo} src="/img/google.png" alt="" />
          Googleでログイン
        </Button>
      </div>
    </Box>
  );
};

export default Login;
