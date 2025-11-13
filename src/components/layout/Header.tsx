import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, userRole, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              💬
            </div>
            <span className="hidden sm:inline">Real-time Q&A</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                {userRole === 'presenter' && (
                  <Link to="/my-sessions">
                    <Button variant="outline" size="sm">
                      📊 대시보드
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}

            {/* 테마 토글 */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              title={`테마: ${theme}`}
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="outline"
              size="icon"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border mt-4">
            {user ? (
              <>
                <p className="text-sm text-muted-foreground px-2 py-2">
                  {user.email}
                </p>
                {userRole === 'presenter' && (
                  <Link to="/my-sessions" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      📊 대시보드
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

