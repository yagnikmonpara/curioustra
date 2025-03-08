<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Response</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1a1a1a; background-color: #f8fafc;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <header style="background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%); padding: 2rem; text-align: center; border-radius: 0 0 20px 20px;">
            <img src="/images/logo.png" alt="CuriousTra Logo" style="height: 40px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
            <h1 style="color: #1e293b; font-size: 1.75rem; margin: 0 0 1rem; font-weight: 600; background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">{{ $subject }}</h1>
        </header>

        <!-- Main Content -->
        <div style="padding: 2rem 2rem 1rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                    <svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h1 style="color: #1e293b; font-size: 1.75rem; margin: 0 0 1rem; font-weight: 600; background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
                    {{ $subject }}
                </h1>
                <p style="color: #64748b; margin: 0; font-size: 1rem;">We're here to help! ✨</p>
            </div>

            <div style="background-color: #ffffff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(14, 165, 233, 0.15);">
                <div style="color: #1e293b; line-height: 1.6; font-size: 1rem; margin-bottom: 1.5rem;">
                    {!! nl2br(e($content)) !!}
                </div>

                <div style="border-top: 2px solid rgba(14, 165, 233, 0.1); padding-top: 1.5rem; margin-top: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 12px; color: #64748b;">
                        <svg style="width: 20px; height: 20px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span style="font-size: 0.9rem;">
                            Your inquiry was submitted on<br>
                            <strong style="color: #0ea5e9;">{{ now()->format('F j, Y \a\t g:i a') }}</strong>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Support CTA -->
            <div style="text-align: center; margin: 2rem 0; padding: 1.5rem; background-color: #f8fafc; border-radius: 8px;">
                <p style="margin: 0 0 0.5rem; color: #64748b; font-size: 0.95rem;">
                    Need more assistance? 🚀
                </p>
                <a href="{{ route('contact') }}" style="color: #0ea5e9; text-decoration: none; font-weight: 500; transition: all 0.2s ease;">
                    Contact Support Team 
                    <span style="display: inline-block; margin-left: 4px;">→</span>
                </a>
            </div>
        </div>

        <!-- Footer -->
        <footer style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 2rem; text-align: center; border-radius: 20px 20px 0 0;">
            <div style="max-width: 400px; margin: 0 auto;">
                <div style="font-size: 0.875rem; line-height: 1.6;">
                    <p style="margin: 0.5rem 0; color: #e2e8f0;">
                        © {{ date('Y') }} CuriousTra. All rights reserved.
                    </p>
                    <p style="margin: 0.5rem 0; color: #94a3b8;">
                        Surat, Gujarat, India - 395006<br>
                        <a href="mailto:info@curioustra.com" style="color: #7dd3fc; text-decoration: none;">info@curioustra.com</a>
                    </p>
                </div>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
                    <a href="#" style="color: #7dd3fc; text-decoration: none;">
                        <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                    </a>
                    <a href="#" style="color: #7dd3fc; text-decoration: none;">
                        <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>