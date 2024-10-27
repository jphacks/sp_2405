import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  description?: string;
  startTime: string;
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
      startTime: "",
      cycleCount: 1,
      tag: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);

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
            name="startTime"
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
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
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
