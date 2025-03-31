<?php

namespace App\Console;

use Illuminate\Console\Kernal as ConsoleKernal;

class Kernal extends ConsoleKernal
{
    protected $commands = [
        Commands\SendNewsletter::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        $schedule->command('newsletter:send')
                    ->weekly() // or whatever frequency you prefer
                    ->mondays()
                    ->at('08:00');
    }
}

?>
