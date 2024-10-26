import handler as handler
import subprocess
from tabulate import tabulate

def run_curl(user_id: str):
    """Execute curl command and print result"""
    cmd = f"curl http://localhost:8000/api/get_user?user_id={user_id}"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(f"\nExecuting: {cmd}")
    print("Response:", result.stdout)

def main():
    # データベース内の既存ユーザーを取得して表示
    users = handler.session.query(handler.UserData).all()
    if users:
        # ユーザー情報を表形式で表示
        user_data = [[u.user_id, u.username, u.email] for u in users]
        print("\n=== Existing Users ===")
        print(tabulate(user_data, headers=['User ID', 'Username', 'Email'], tablefmt='grid'))

        # 最初のユーザーでテスト
        print("\n=== Testing API with first user ===")
        first_user = users[0]
        run_curl(first_user.user_id)

        # 不正なユーザーIDでテスト
        print("\n=== Testing API with invalid user ID ===")
        run_curl("invalid_id")

if __name__ == "__main__":
    main()
