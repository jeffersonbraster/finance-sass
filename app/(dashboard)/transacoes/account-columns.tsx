import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"


type Props = {
  account: string
  accountId: string
}

const AccountColumns = ({account, accountId}: Props) => {
  const {onOpen: onOpenAccount} = useOpenAccount()

  const handleOpenAccount = () => {
    onOpenAccount(accountId)
  }

  return (
    <div className="flex items-center cursor-pointer hover:underline" onClick={handleOpenAccount}>
      {account}
    </div>
  )
}

export default AccountColumns