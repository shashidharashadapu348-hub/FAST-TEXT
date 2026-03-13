import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Flame, Lock } from 'lucide-react';

interface ShareOptionsProps {
  expiration: string;
  setExpiration: (v: string) => void;
  burnAfterRead: boolean;
  setBurnAfterRead: (v: boolean) => void;
  password: string;
  setPassword: (v: string) => void;
}

const ShareOptions = ({
  expiration, setExpiration,
  burnAfterRead, setBurnAfterRead,
  password, setPassword,
}: ShareOptionsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Select value={expiration} onValueChange={setExpiration}>
          <SelectTrigger className="w-[120px] h-8 bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="1d">1 day</SelectItem>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="never">Never</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="burn" className="text-muted-foreground cursor-pointer text-xs">
          Burn after read
        </Label>
        <Switch
          id="burn"
          checked={burnAfterRead}
          onCheckedChange={setBurnAfterRead}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        {showPassword ? (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[140px] h-8 bg-secondary border-border text-foreground"
          />
        ) : (
          <button
            onClick={() => setShowPassword(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Add password
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareOptions;
