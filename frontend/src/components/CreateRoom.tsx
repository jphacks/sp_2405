import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface FormValues {
  title: string;
  description?: string;
  startAt: string;
  cycleCount: number;
  tag?: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const tagOptions = ["Study", "Work", "Programming", "Workout"];

const CreateRoom = ({open, onClose}: ModalProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      startAt: "",
      cycleCount: 1,
      tag: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (raw: FormValues) => {
    console.log(raw);

    const data = {
      title: raw.title,
      description: raw.description,
      start_at: raw.startAt,
      cycle_num: raw.cycleCount,
      tag: raw.tag,
    };

    const res = await axios.post('http://localhost:8000/api/create_room', data, {withCredentials: true});
    console.log(res.data)
    // Cookies.set("ROOM_ID", room_id, { expires: 10 });

    navigate('/home/room');
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>部屋作成</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            rules={{ required: "タイトルは必須です" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="タイトル"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                required
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="説明"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            )}
          />

          <Controller
            name="startAt"
            control={control}
            rules={{
              required: "開始時刻は必須です",
              validate: (value) => {
                const now = new Date();
                const inputDate = new Date(value);
                return inputDate >= now || "過去の時刻は入力できません";
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="開始時刻"
                type="datetime-local"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.startAt}
                helperText={errors.startAt?.message}
                required
              />
            )}
          />

          <Controller
            name="cycleCount"
            control={control}
            rules={{
              required: "サイクル数は必須です",
              min: {
                value: 1,
                message: "サイクル数は1以上である必要があります",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="サイクル数"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.cycleCount}
                helperText={errors.cycleCount?.message}
                required
              />
            )}
          />

          <Controller
            name="tag"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>タグ</InputLabel>
                <Select {...field} label="タグ" defaultValue="">
                  {tagOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            キャンセル
          </Button>
          <Button type="submit" color="primary" variant="contained">
            送信
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateRoom
